import { AsyncStorage } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist'
import sessionReducer from '../reducers/session';
import networkReducer from '../reducers/network';

const appReducer = persistCombineReducers(
  {
    key: 'my_key',
    storage: AsyncStorage,
    blacklist: ['data'],
  },
  {
    session: sessionReducer,
    network: networkReducer,
  }
);

let store = createStore(appReducer);

export const persist = persistStore(store);
export default store;
