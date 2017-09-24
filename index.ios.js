/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  StatusBar,
  TabBarIOS,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import BadInstagramExample from './components/BadInstagramExample';
import BaseView from './components/BaseView';

export default class TaggingTracker extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <NavigatorIOS
          initialRoute={{
            component: BaseView,
            title: 'Current Tags'
          }}
          style={{flex: 1}}
          barTintColor="#000000"
          tintColor="#ffffff"
          titleTextColor="#ffffff"
        >
        </NavigatorIOS>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('TaggingTracker', () => TaggingTracker);
