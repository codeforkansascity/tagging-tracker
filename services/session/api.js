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
    .passwordRealm({username: authentication.email, password: authentication.password, realm: "Username-Password-Authentication"})
    .then(response => {
      return {
        user: {
          id: 25
        },
        tokens: [
          {
            type: 'access',
            value: response.accessToken,
            expiresIn: response.expiresIn,
          }, 
          {
            type: 'refresh',
            value: 'refresh',
          }
        ],
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
      tokens: [
        {
          type: 'access',
          value: null,
          expiresIn: null,
        },
        {
          type: 'refresh',
          value: null,
        }
      ],
      user: {
        id: null
      }
    });
  });
}

export const authenticate = (email, password) => fetchApi(endPoints.authenticate, {}, 'post', { email, password });

export const refresh = (token, user) => fetchApi(endPoints.refresh, { token, user }, 'post', {
  'Client-ID': credentials.clientId,
  Authorization: null,
});

export const revoke = (tokens) => fetchApi(endPoints.revoke, { tokens }, 'post');
