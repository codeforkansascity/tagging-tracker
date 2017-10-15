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

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';

import BaseView from './BaseView';
import realm from '../realm';
import { NavigationActions } from 'react-navigation'

const win = Dimensions.get('window');

export default class NewTagData extends Component {
  static navigationOptions = ({navigation}) => {
    const { state } = navigation;
    const { submitForm } = state.params;
    const buttonColor = Platform.OS === 'ios' ? '#ffffff' : '#000000'
    return {
      headerTitle: 'New Tag',
      headerRight: (<Button title="Save" color={buttonColor} onPress={() => submitForm()} />),
    };
  };
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
    this.props.navigation.setParams({ submitForm: this.submitForm.bind(this), ...this.props.navigation.params });
    navigator.geolocation.getCurrentPosition(this.getNeighborhoodCoordinates.bind(this), () => {}, {maximumAge: 2000});
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
    TagParams.img = this.props.navigation.state.params.data.path;

    realm.write(() => {
      realm.create('Tag', TagParams);
    });

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'})
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <Image 
          style={{width: win.width, height: 200}}
          source={{uri: this.props.navigation.state.params.data.path}}
        /> 
        <View style={{padding: 20 }}>
          <Text>Tag Description</Text>
          <TextInput style={styles.input} value={this.state.description} onChangeText={(description) => this.setState({description})} />
          <Text>Square Footage</Text>
          <TextInput style={styles.input} value={this.state.square_footage} onChangeText={(square_footage) => this.setState({square_footage})} />
          <Text>Neighborhood</Text>
          <TextInput style={styles.input} value={this.state.neighborhood} onChangeText={(neighborhood) => this.setState({neighborhood})} />
          <Text>Describe the words of this Tag</Text>
          <TextInput multiline={true} style={styles.input} value={this.state.tag_words} onChangeText={(tag_words) => this.setState({tag_words})} />
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
