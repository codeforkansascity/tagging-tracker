/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  NetInfo,
  View,
} from 'react-native';

import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';

import store, { persistor } from './store';
import App from './components/App';

export default TaggingTracker = () => 
  <Provider store={store}>
    <PersistGate
      loading={<View><Text>Loading</Text></View>}
      persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  
AppRegistry.registerComponent('TaggingTracker', () => TaggingTracker);
