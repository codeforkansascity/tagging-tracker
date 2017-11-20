import { Buffer } from 'buffer';
import config from '../../config/AuthenticationServer';
import axios from 'axios';

const endPoints = {
  authenticate: '/users/auth',
  revoke: '/users/auth/revoke',
  refresh: '/users/auth/refresh',
};

const fetchApi = (url, options, method, authentication) => {  
  return axios.get('https://data.kcmo.org/resource/cyqf-nban.json')
    .then(() => {
      if (!authentication.Authorization.includes('amFrZS5sYWN')) {
        throw new Error('Password is bad');
      }

      return {
        user: {
          id: 25
        },
        tokens: [
          {
            type: 'access',
            value: 'value',
            expiresIn: '3600',
          }, 
          {
            type: 'refresh',
            value: 'refresh',
          }
        ],
      };
    });
}

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
        id: 'blank'
      }
    });
  });
}

export const authenticate = (email, password) => fetchApi(endPoints.authenticate, {}, 'post', {
  Authorization: `Basic ${new Buffer(`${email}:${password}`).toString('base64')}`,
});

export const refresh = (token, user) => fetchApi(endPoints.refresh, { token, user }, 'post', {
  'Client-ID': config.clientId,
  Authorization: null,
});

export const revoke = (tokens) => fetchApi(endPoints.revoke, { tokens }, 'post');
