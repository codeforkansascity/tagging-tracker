import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  Button,
  Platform,
  ScrollView,
} from 'react-native';


import Geocoder from 'react-native-geocoding';
import { SegmentedControls } from 'react-native-radio-buttons';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import shortid from 'shortid';

import BaseView from './BaseView';
import realm from '../realm';
import store from '../store';
import networkActions from '../services/network/actions';
import * as networkSelectors from '../services/network/selectors';
import { uploadAddress } from '../services/tagging_tracker';
import taggingTrackerActions from '../services/tagging_tracker/actions';

const win = Dimensions.get('window');

const options = [
  1, 
  2, 
  3,
];

const optionDisplays = [
  'Commercial', 
  'Residential', 
  'Public',
];

export default class NewAddress extends Component {
  static navigationOptions = ({navigation}) => {
    let navigationOptions = { headerTitle: 'New Address' };
    const { state } = navigation;

    if (state.params) {
      const { submitForm } = state.params;
      const buttonColor = Platform.OS === 'ios' ? '#ffffff' : '#000000';
      navigationOptions.headerRight = <Button title="Save" color={buttonColor} onPress={() => submitForm()} />;
    }

    return navigationOptions;
  };

  constructor(props) {
    super(props);

    this.state = {
      street: '',
      city: '',
      state: '',
      zip: '',
      latitude: '',
      longitude: '',
      tag_words: '',
      type_of_property: 1,
      land_bank_property: false,
      owner_name: '',
      owner_contact_number: '',
      owner_email: '',
      tenant_name: '',
      tenant_phone: '',
      tenant_email: '',
      follow_up_owner_needed: false,
    };

    this.navigateOnSubmit = this.navigateOnSubmit.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ submitForm: this.submitForm.bind(this), ...this.props.navigation.params });
    navigator.geolocation.getCurrentPosition(this.getNeighborhoodCoordinates.bind(this), () => {}, {maximumAge: 2000});
  }

  getNeighborhoodCoordinates(pos) {
    Geocoder.setApiKey('AIzaSyD4Oan5v5glCpoKUNUN_AjckZ29YeETzV4');

    Geocoder.getFromLatLng(pos.coords.latitude, pos.coords.longitude).then(
      json => {
        let addressAttributes = json.results[0].address_components.reduce((initialValue, component) => {
          initialValue[component.types[0]] = component.long_name
          return initialValue;
        }, {});

        let street = '';

        if(addressAttributes.street_number && addressAttributes.route) {
          street = `${addressAttributes.street_number} ${addressAttributes.route}`
        } else if (addressAttributes.street_number) {
          street = addressAttributes.street_number;
        } else if (addressAttributes.route) {
          street = addressAttributes.route;
        }

        this.setState({
          neighborhood: addressAttributes.neighborhood,
          street,
          city: addressAttributes.locality,
          state: addressAttributes.administrative_area_level_1,
          zip: addressAttributes.postal_code,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
  }

  submitForm() {
    let address;

    const addressParams = Object.assign({}, this.state);
    const userId = store.getState().session.user.id;
    addressParams.id = shortid.generate();
    addressParams.date_updated = new Date();
    addressParams.creator_user_id = userId;
    addressParams.last_updated_user_id = userId;
    addressParams.uploaded_online = false;
    addressParams.longitude = this.state.longitude;
    addressParams.latitude = this.state.latitude;

    realm.write(() => {
      address = realm.create('Address', addressParams);
    });

    if(networkSelectors.get().isConnected) {
      uploadAddress(address.serviceProperties)
        .then(response => {
          realm.write(() => {
            address.id = response.id;
            address.uploaded_online = true;
          });
        })
        .then(this.navigateOnSubmit)
        .catch(error => {
          alert('Address could not be saved. Please try again');
        })
    } else {
      const request = { action: 'UPLOAD', type: 'Address', entity: address.serviceProperties };
      store.dispatch(taggingTrackerActions.addToQueue({ request }));
      this.navigateOnSubmit();
    }
  }

  navigateOnSubmit() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'})
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }

  setSelectedOption(type_of_property){
    this.setState({
      type_of_property
    });
  }

  renderOption(option, selected, onSelect, index) {
    const style = {
      textAlign: 'center',
    }
    style.fontWeight = selected ? 'bold' : 'normal';
    style.color = selected ? '#fff' : '#000';
    
    return (
      <View key={index}>
        <Text onPress={onSelect} style={style}>{optionDisplays[option-1]}</Text>
      </View>
    );
  }
 
  renderContainer(optionNodes) {
    return <View>{optionNodes}</View>;
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 20 }}>
          <Text>Street</Text>
          <TextInput style={styles.input} value={this.state.street} onChangeText={(street) => this.setState({street})} />
          <Text>City</Text>
          <TextInput style={styles.input} value={this.state.city} onChangeText={(city) => this.setState({city})} />
          <Text>State</Text>
          <TextInput style={styles.input} value={this.state.state} onChangeText={(state) => this.setState({state})} />
          <Text>Neighborhood</Text>
          <TextInput style={styles.input} value={this.state.neighborhood} onChangeText={(neighborhood) => this.setState({neighborhood})} />
          <Text>ZIP</Text>
          <TextInput style={styles.input} value={this.state.zip} onChangeText={(zip) => this.setState({zip})} />
          <Text>Property Type</Text>
          <SegmentedControls
            options={ options }
            onSelection={ this.setSelectedOption.bind(this) }
            selectedOption={this.state.type_of_property }
            renderOption={ this.renderOption.bind(this) }
            renderContainer={ this.renderContainer.bind(this) }
            selectedTint= {'white'}
          />
          <TextInput style={styles.input} value={this.state.property_type} onChangeText={(property_type) => this.setState({property_type})} />
          <Text>Owner Name</Text>
          <TextInput style={styles.input} value={this.state.owner_name} onChangeText={(owner_name) => this.setState({owner_name})} />
          <Text>Owner Number</Text>
          <TextInput style={styles.input} value={this.state.owner_number} onChangeText={(owner_number) => this.setState({owner_number})} />
          <Text>Owner Email</Text>
          <TextInput style={styles.input} value={this.state.owner_email} onChangeText={(owner_email) => this.setState({owner_email})} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginBottom: 10,
    marginTop: 5,
    color: '#0000ff',
  }
});
