/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';

import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import BaseView from './components/BaseView';
import TagPhoto from './components/TagPhoto';
import NewTagData from './components/NewTagData';
import TagList from './components/TagList';
import TagView from './components/TagView';
import Login from './components/Login';
import store from './store';

const initialRoute = store.getState().session.user.id ? 'Home' : 'Login';

const StackNavigation = StackNavigator({
  Home: { screen: BaseView },
  TagPhoto: { screen: TagPhoto },
  NewTagData: { screen: NewTagData },
  TagList: { screen: TagList },
  TagView: { screen: TagView },
  Login: { screen: Login }
}, {
  initialRouteName: initialRoute,
  navigationOptions: {
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: '#000000',
    }
  }
});

export default TaggingTracker = () => (
  <Provider store={store}>
    <StackNavigation />
  </Provider>
);

AppRegistry.registerComponent('TaggingTracker', () => TaggingTracker);
