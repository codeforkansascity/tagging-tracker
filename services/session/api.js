import { Buffer } from 'buffer';
import axios from 'axios';
import Auth0 from 'react-native-auth0';

import store from '../../store';
import credentials from '../../config/Auth0Config';

const auth0 = new Auth0(credentials);

const endPoints = {
  authenticate: '/users/auth',
  revoke: '/users/auth/revoke',
  refresh: '/users/auth/refresh',
};

const fetchApi = (url, options, method, authentication) => {
  return auth0
    .auth
    .passwordRealm({
      username: authentication.email,
      password: authentication.password,
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

export const authenticate = (email, password) => fetchApi(endPoints.authenticate, {}, 'post', { email, password });

export const refresh = (token, user) => auth0
  .auth
    .refreshToken({refreshToken: token})
    .then(response => {
      return {
        tokens: {
          access: {
            value: response.accessToken,
            expiresIn: response.expiresIn,
          }, 
          refresh: {
            value: token,
          }
        },
        user: store.getState().session.user,
      };
    });

export const revoke = (tokens) => fetchApi(endPoints.revoke, { tokens }, 'post');
