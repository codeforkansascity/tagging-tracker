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
  TabBarIOSItem
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';

import BaseView from './BaseView';
import realm from '../realm';

const win = Dimensions.get('window');



export default class NewTagData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      neighborhood: '',
      square_footage: '',
      description: '',
      tag_words: '',
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(this.getNeighborhoodCoordinates.bind(this), () => {}, {});
  }

  getNeighborhoodCoordinates(pos) {
    Geocoder.setApiKey('AIzaSyD4Oan5v5glCpoKUNUN_AjckZ29YeETzV4');

    Geocoder.getFromLatLng(pos.coords.latitude, pos.coords.longitude).then(
      json => {
        var address_component = json.results[0].address_components.find((component) => {
          return component.types.includes('neighborhood');
        });

        if(address_component) {
          this.setState({
            neighborhood: address_component.long_name
          });
        }
      },
      error => {
      }
    );
  }

  submitForm() {
    const TagParams = Object.assign({}, this.state);
    TagParams.img = this.props.data.path;

    realm.write(() => {
      realm.create('Tag', TagParams);
    });

    this.props.navigator.popToTop();
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 64}}>
        <View style={{padding: 20 }}>
          <Text>Tag</Text>
          <Image 
            style={{width: win.width - 40, height: 200, marginTop: 10, marginBottom: 10}}
            source={{uri: this.props.data.path}}
          /> 
          <Text>Tag Description</Text>
          <TextInput style={styles.input} value={this.state.description} onChangeText={(description) => this.setState({description})} />
          <Text>Square Footage</Text>
          <TextInput style={styles.input} value={this.state.square_footage} onChangeText={(square_footage) => this.setState({square_footage})} />
          <Text>Neighborhood</Text>
          <TextInput style={styles.input} value={this.state.neighborhood} onChangeText={(neighborhood) => this.setState({neighborhood})} />
          <Text>Describe the words of this Tag</Text>
          <TextInput multiline={true} style={styles.input} value={this.state.tag_words} onChangeText={(tag_words) => this.setState({tag_words})} />
        </View>
      </View>
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
