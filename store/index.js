import { AsyncStorage } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import sessionReducer from '../reducers/session';
import networkReducer from '../reducers/network';

const appReducer = persistCombineReducers(
  {
    key: 'primary',
    storage,
  },
  {
    session: sessionReducer,
    network: networkReducer,
  }
);

let store = createStore(appReducer);

export const persistor = persistStore(store, () => (store.getState()));
export default store;
