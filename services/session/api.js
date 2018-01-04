import { Buffer } from 'buffer';
import axios from 'axios';
import Auth0 from 'react-native-auth0';

import store from '../../store';
import credentials from '../../config/Auth0Config';
import * as SessionSelectors from './selectors';

const auth0 = new Auth0(credentials);

export const authenticate = (email, password) => {
  return auth0
    .auth
    .passwordRealm({
      username: email,
      password: password,
      realm: 'Username-Password-Authentication',
      scope: 'openid profile email address phone offline_access',
    })
    .then(response => {
      return {
        tokens: {
          access: {
            value: response.accessToken,
            expiresIn: response.expiresIn,
          }, 
          refresh: {
            value: response.refreshToken,
          }
        },
      };
    });
}

export const getUserInfo = () =>
  auth0
    .auth
    .userInfo({token: store.getState().session.tokens.access.value})
    .then(response => response);

export const logOut = () => {
  return new Promise((resolve, reject) => {
    resolve({
      tokens: {
        access: {
          value: null,
          expiresIn: null,
        },
        refresh: {
          value: null,
        }
      },
      user: {
        id: null
      }
    });
  });
}

export const refresh = () =>
  auth0
    .auth
    .refreshToken({refreshToken: SessionSelectors.get().tokens.refresh.value})
    .then(response => {
      return {
        tokens: {
          access: {
            value: response.accessToken,
            expiresIn: response.expiresIn,
          }, 
          refresh: SessionSelectors.get().tokens.refresh.value,
        },
        user: store.getState().session.user,
      };
    });

export const revoke = (tokens) => fetchApi(endPoints.revoke, { tokens }, 'post');
