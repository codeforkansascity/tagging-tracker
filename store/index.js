import { AsyncStorage } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

import sessionReducer from '../reducers/session';
import networkReducer from '../reducers/network';
import taggingTrackerReducer from '../reducers/tagging_tracker';

const appReducer = persistCombineReducers(
  {
    key: 'primary',
    storage,
  },
  {
    session: sessionReducer,
    network: networkReducer,
    tagging_tracker: taggingTrackerReducer,
  }
);

let store = createStore(appReducer);

export const persistor = persistStore(store, () => (store.getState()));
export default store;
