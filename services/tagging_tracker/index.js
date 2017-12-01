import axios from 'axios';
import Config from 'react-native-config'

import store from '../../store';

const createAddressParams = (addressParams) => {
  let additonalParams = {
    point: {
      type: 'Point',
      coordinates: [addressParams.longitude, addressParams.latitude],
    },
  };

  return Object.assign(addressParams, additonalParams);
}

export const uploadAddress = (addressParams) =>(
  axios.post(`${Config.TAGGING_TRACKER_SERVICE_DOMAIN}/address/`,
    createAddressParams(addressParams),
    {
      headers: {'Authorization': store.getState().session.tokens.access.value},
    }
  )
);
