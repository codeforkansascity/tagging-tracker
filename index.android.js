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
import { StackNavigator } from 'react-navigation';
import BaseView from './components/BaseView';
import TagPhoto from './components/TagPhoto';
import NewTagData from './components/NewTagData';
import TagList from './components/TagList';
import TagView from './components/TagView';

export default TaggingTracker = StackNavigator({
  Home: { screen: BaseView },
  TagPhoto: { screen: TagPhoto },
  NewTagData: { screen: NewTagData },
  TagList: { screen: TagList },
  TagView: { screen: TagView },
}, {
  navigationOptions: {
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: '#000000',
    }
  }
});

AppRegistry.registerComponent('TaggingTracker', () => TaggingTracker);
