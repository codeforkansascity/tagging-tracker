/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
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
import TagView from './TagView';
import Login from './Login';
import store from '../store';
import networkActions from '../services/network/actions';
import { uploadSavedTasks } from '../services/tagging_tracker/offline_upload';
import { fetchAddresses, fetchTags } from '../services/tagging_tracker';

export default class TaggingTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingData: true
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange.bind(this));

    fetchAddresses()
      .then(fetchTags)
      .then(response => {
        this.setState({
          fetchingData: false
        });
      });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange.bind(this));
  }

  handleConnectionChange(isConnected) {
    store.dispatch(networkActions.connectionState({ status: isConnected }));

    if(isConnected) {
      uploadSavedTasks();
    }
  }

  render() {
    const { access } = store.getState().session.tokens;
    const initialRouteName = access && access.value ? 'Home' : 'Login';
    const initialRouteParams = { initializingApp: true };

    const StackNavigation = StackNavigator({
      Home: { screen: BaseView },
      TagPhoto: { screen: TagPhoto },
      NewTagData: { screen: NewTagData },
      NewAddress: { screen: NewAddress },
      AddressList: { screen: AddressList },
      AddressView: { screen: AddressView },
      TagView: { screen: TagView },
      Login: { screen: Login },
    }, {
      initialRouteName,
      initialRouteParams,
      navigationOptions: {
        headerTintColor: '#ffffff',
        headerStyle: {
          backgroundColor: '#000000',
        }
      }
    });

    if(this.state.fetchingData) {
      return (
        <ActivityIndicator style={{flex: 1}} />
      );
    } else {
      return(
        <StackNavigation />
      );
    }
  }
}
