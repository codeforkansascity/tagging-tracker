import axios from 'axios';
import Config from 'react-native-config'

import store from '../../store';

export const uploadAddress = (address) => (
  axios.post(`${Config.TAGGING_TRACKER_SERVICE_DOMAIN}/address/`,
    address,
    {
      headers: {'Authorization': store.getState().session.tokens.access.value},
    }
  )
);

export const uploadTag = (tag) => (
  axios.post(`${Config.TAGGING_TRACKER_SERVICE_DOMAIN}/tags/`,
    tag,
    {
      headers: {'Authorization': store.getState().session.tokens.access.value},
    }
  )
);
