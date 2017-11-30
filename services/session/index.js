import store from '../../store';

import * as api from './api';
import * as selectors from './selectors';
import * as actionCreators from './actions';

const SESSION_TIMEOUT_THRESHOLD = 300; // Will refresh the access token 5 minutes before it expires

let sessionTimeout = null;

const setSessionTimeout = (duration) => {
  sessionTimeout = setTimeout(
    refreshToken,
    (duration - SESSION_TIMEOUT_THRESHOLD) * 1000
  );
};

const clearSession = () => {
  clearTimeout(sessionTimeout);
  store.dispatch(actionCreators.update());
};

const onRequestSuccess = (response) => {
  const { tokens, user } = response;
  store.dispatch(actionCreators.update({ tokens, user }));
  setSessionTimeout(tokens.access.expiresIn);
};

const onRequestFailed = (exception) => {
  clearSession();
  throw exception;
};

const setUser = (response) => {
  const userId = response.sub.split('|')[1];
  const tokens = store.getState().session.tokens;
  store.dispatch(actionCreators.update({ tokens, user: {id: userId} }))
}

export const refreshToken = () => {
  const session = store.getState().session;

  if (!session.tokens.refresh.value || !session.user.id) {
    return Promise.reject();
  }

  return api.refresh(session.tokens.refresh.value)
    .then(onRequestSuccess)
    .catch(onRequestFailed);
};

export const logOut = () =>
  api.logOut()
    .then(onRequestSuccess)
    .catch(onRequestFailed);

export const authenticate = (email, password) =>
  api.authenticate(email, password)
    .then(onRequestSuccess)
    .then(api.getUserInfo)
    .then(setUser)
    .catch(onRequestFailed);

export const revoke = () => {
  const session = selectors.get();
  return api.revoke(Object.keys(session.tokens).map(tokenKey => ({
    type: session.tokens[tokenKey].type,
    value: session.tokens[tokenKey].value,
  })))
  .then(clearSession())
  .catch(() => {});
};
