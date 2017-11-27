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
import { SegmentedControls } from 'react-native-radio-buttons'

import BaseView from './BaseView';
import realm from '../realm';
import { NavigationActions } from 'react-navigation'

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

export default class NewTagData extends Component {
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

        this.setState({
          neighborhood: addressAttributes.neighborhood,
          street: `${addressAttributes.street_number} ${addressAttributes.route}`,
          city: addressAttributes.locality,
          state: addressAttributes.administrative_area_level_1,
          zip: addressAttributes.postal_code,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
  }

  submitForm() {
    const TagParams = Object.assign({}, this.state);
    TagParams.date_updated = new Date();

    realm.write(() => {
      realm.create('Address', TagParams);
    });

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
