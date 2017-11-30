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
} from 'react-native';

import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';

import BaseView from './BaseView';
import TagPhoto from './TagPhoto';
import NewTagData from './NewTagData';
import AddressList from './AddressList';
import AddressView from './AddressView';
import NewAddress from './NewAddress';
import TagList from './TagList';
import TagView from './TagView';
import Login from './Login';
import store from '../store';
import networkActions from '../services/network/actions';

export default class TaggingTracker extends Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange.bind(this));
    NetInfo.isConnected.fetch().then(this.handleConnectionChange.bind(this));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange.bind(this));
  }

  handleConnectionChange(isConnected) {
    store.dispatch(networkActions.connectionState({ status: isConnected }));
    let actionQueue = store.getState().network.queue;

    if(isConnected && actionQueue.length > 0) {
      actionQueue.forEach((request) => {
        if(request) {
          request();
        }

        store.dispatch(networkActions.removeFromQueue({request}))
      });
    }
  }

  render() {
    const { access } = store.getState().session.tokens;
    const initialRouteName = access && access.value ? 'Home' : 'Login';

    const StackNavigation = StackNavigator({
      Home: { screen: BaseView },
      TagPhoto: { screen: TagPhoto },
      NewTagData: { screen: NewTagData },
      NewAddress: { screen: NewAddress },
      AddressList: { screen: AddressList },
      AddressView: { screen: AddressView },
      TagList: { screen: TagList },
      TagView: { screen: TagView },
      Login: { screen: Login },
    }, {
      initialRouteName,
      navigationOptions: {
        headerTintColor: '#ffffff',
        headerStyle: {
          backgroundColor: '#000000',
        }
      }
    });

    return(
      <StackNavigation />
    );
  }
}
