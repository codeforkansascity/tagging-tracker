/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  Platform,
  NetInfo,
  Text,
} from 'react-native';

import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import Toast from 'react-native-simple-toast';

import BaseView from './BaseView';
import TagPhoto from './TagPhoto';
import NewTagData from './NewTagData';
import AddressList from './AddressList';
import AddressView from './AddressView';
import NewAddress from './NewAddress';
import TagView from './TagView';
import TagEdit from './TagEdit';
import Login from './Login';
import Notifications from './Notifications';
import store from '../store';
import { getNetworkConnectionStatus } from '../services/network/api';
import networkActions from '../services/network/actions';
import * as SessionSelectors from '../services/session/selectors';
import * as NetworkSelectors from '../services/network/selectors';
import * as SessionMethods from '../services/session';
import { uploadSavedTasks } from '../services/tagging_tracker/offline_upload';
import { fetchAddresses, fetchTags } from '../services/tagging_tracker';

export default class TaggingTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingData: true,
      checkingConnection: true,
      authenticating: true,
    };

    this.initializeData = this.initializeData.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    getNetworkConnectionStatus()
      .then(this.initializeData)
  }

  initializeData(isConnected) {
    store.dispatch(networkActions.connectionState({ isConnected }));

    this.setState({
      checkingConnection: false,
    });

    if (isConnected) {
      SessionMethods
        .authenticateFromToken()
        .catch(response => {
          Toast.show('Authentication Server is Down. Data will be saved to device until the next successful login.');
        })
        .finally(response => {
          this.setState({
            authenticating: false
          })
        });

      fetchAddresses()
        .then(fetchTags)
        .catch(error => {
          Toast.show('Server is currently down. You will not be able to access database.');
        })
        .finally(error => {
          this.setState({
            fetchingData: false
          });
        });
    } else {
      this.setState({
        fetchingData: false,
        authenticating: false,
      })
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange(isConnected) {
    store.dispatch(networkActions.connectionState({ isConnected }));

    if (isConnected) {
      uploadSavedTasks();
    }
  }

  render() {
    if(this.state.fetchingData || this.state.checkingConnection || this.state.authenticating) {
      return (
        <ActivityIndicator style={{flex: 1}} />
      );
    } else {
      const { access } = SessionSelectors.get().tokens;
      const initialRouteParams = { initializingApp: true };
      let initialRouteName = access && access.value ? 'Home' : 'Login';

      if(!NetworkSelectors.get().isConnected) {
        initialRouteName = 'Home';
        Toast.showWithGravity('Device Offline. You will not be able to upload data to servers.', Toast.SHORT, Toast.BOTTOM)
      }

      const StackNavigation = StackNavigator({
        Home: { screen: BaseView },
        TagPhoto: { screen: TagPhoto },
        NewTagData: { screen: NewTagData },
        NewAddress: { screen: NewAddress },
        AddressList: { screen: AddressList },
        AddressView: { screen: AddressView },
        TagView: { screen: TagView },
        TagEdit: { screen: TagEdit },
        Login: { screen: Login },
        Notifications: { screen: Notifications },
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

      return(
        <StackNavigation />
      );
    }
  }
}
