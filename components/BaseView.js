import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  TextInput,
  FlatList,
  ListItem,
} from 'react-native';

import Toast from 'react-native-simple-toast';

import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import { DialogComponent, DialogTitle, DialogContent, DialogButton } from 'react-native-dialog-component';
import Geocoder from 'react-native-geocoding';
import { NavigationActions } from 'react-navigation';
import Config from 'react-native-config';
import shortid from 'shortid';

import TagPhoto from './TagPhoto';
import realm from '../realm';
import store from '../store';
import * as NetworkSelectors from '../services/network/selectors';
import * as SessionSelectors from '../services/session/selectors';
import * as SessionMethods from '../services/session/';

export default class BaseView extends Component {
  static navigationOptions = {
    title: 'Neighborhoods',
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
      neighborhoods: [],
      addresses: [],
      queriedAddresses: [],
      isLoading: false,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.setState({
      addresses: realm.objects('Address'),
      isLoading: false,
    });
  }

  alphabetizeNeighborhoods(a, b) {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  getNeighborhoods() {
    const currentNeighborhoods = [];

    return this.state.addresses
        .map(tag => ({name: tag.neighborhood}))
        .filter(neighborhood => {
          if (currentNeighborhoods.includes(neighborhood.name)) {
            return false;
          } else {
            currentNeighborhoods.push(neighborhood.name);
            return true;
          }
        });
  }

  login() {
    this.props.navigation.navigate('Login');
  }

  logout() {
    SessionMethods.logOut();
    this.login();
  }

  showAddresses() {
    navigator.geolocation.getCurrentPosition(this.getAddressCoordinates.bind(this), () => {}, {maximumAge: 2000});
  }

  getAddressCoordinates(pos) {
    Geocoder.setApiKey('AIzaSyD4Oan5v5glCpoKUNUN_AjckZ29YeETzV4');

    Geocoder.getFromLatLng(pos.coords.latitude, pos.coords.longitude).then(
      json => {
        let addressAttributes = json.results[0].address_components.reduce((initialValue, component) => {
          initialValue[component.types[0]] = component.long_name
          return initialValue;
        }, {});

        if (!addressAttributes.street_number) {
          addressAttributes.street_number = '';
        }

        if (!addressAttributes.route) {
          addressAttributes.route = '';
        }

        let addresses = realm.objects('Address')
          .filtered('street CONTAINS $0', addressAttributes.street_number || '')
          .filtered('street CONTAINS $0', addressAttributes.route);

        if(addresses.length > 0) {
          this.setState({
            queriedAddresses: addresses,
          });

          this.popupDialog.show();
        } else {
          this.navigateNewAddress();
        }
      },
      error => {
      }
    );
  }

  navigateNewAddress() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
        NavigationActions.navigate({ routeName: 'NewAddress'}),
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const nextRoute = {
      component: TagPhoto,
      title: '',
      passProps: { myProp: 'bar' }
    };

    const { navigate } = this.props.navigation;

    return(
      <View style={{flex: 1, marginTop: 0}}>
        <DialogComponent
          height={400}
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          actions={[<DialogButton key="add" text="Add Address" align="center" onPress={this.navigateNewAddress.bind(this)}/>]}
        >
          <DialogTitle title="Is it one of these addresses?" />
          <DialogContent contentStyle={{flex: 5}}>
            <View>
              <FlatList
                ItemSeparatorComponent={this.renderSeparator}
                data={this.state.queriedAddresses}
                keyExtractor={item => shortid.generate()}
                renderItem={({item}) => {
                    return (
                      <TouchableHighlight
                        onPress={() => {
                            this.popupDialog.dismiss();
                            this.props.navigation.navigate('AddressView', {addressId: item.id})
                          }}
                      >
                        <View>
                          <Text 
                            key={item.id} 
                            style={styles.listItem}
                          >
                            {item.street}
                          </Text> 
                        </View>
                      </TouchableHighlight>
                    )
                  }
                }
              />
            </View>
          </DialogContent>
        </DialogComponent>
        <View style={{flex: 14}}>
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.getNeighborhoods()}
            refreshing={this.state.isLoading}
            onRefresh={this.fetchAddresses}
            renderItem={({item}) => {
                return (
                  <TouchableHighlight
                   onPress={() => {this.props.navigation.navigate('AddressList', {neighborhood: item.name})}}
                  >
                    <View style={{backgroundColor: '#ffffff'}}>
                      <Text style={styles.listItem}>{item.name}</Text>
                    </View>
                  </TouchableHighlight>
                )
              }
            }
            keyExtractor={item => item.name}
          />
        </View>
        <TabNavigator
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black"
          >
          <TabNavigator.Item
            title="Add Address"
            renderIcon={() => <Icon name="ios-add" size={30}
            style={{backgroundColor: '#00000000'}}
            onPress={this.showAddresses.bind(this)}
             />}
            >
          </TabNavigator.Item>
          {this.renderAuthenticationButton()}
        </TabNavigator>
      </View>
    );
  }

  renderAuthenticationButton() {
    const { access, refresh } = SessionSelectors.get().tokens;

    if(access.value || refresh.value) {
      return <TabNavigator.Item
        title="Logout"
        renderIcon={() => <Icon name="ios-log-out" size={30}
        style={{backgroundColor: '#00000000'}}
        onPress={this.logout}
         />}
        >
      </TabNavigator.Item>
    } else {
      return <TabNavigator.Item
        title="Login"
        renderIcon={() => <Icon name="ios-log-in" size={30}
        style={{backgroundColor: '#00000000'}}
        onPress={this.login}
         />}
        >
      </TabNavigator.Item>
    }
  }
}


const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    borderTopColor: '#dddddd'
  },
});