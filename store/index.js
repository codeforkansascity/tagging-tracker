import { AsyncStorage } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist'
import sessionReducer from '../reducers/session';

const appReducer = persistCombineReducers(
  {
    key: 'my_key',
    storage: AsyncStorage,
    blacklist: ['data'],
  },
  {
    session: sessionReducer
  }
);

let store = createStore(appReducer);

export const persist = persistStore(store);
export default store;
