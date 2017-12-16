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
import AzureImageUpload from '../util/AzureImageUpload';
import { NavigationActions } from 'react-navigation'

const win = Dimensions.get('window');

export default class NewTagData extends Component {
  static navigationOptions = ({navigation}) => {
    const { state } = navigation;
    const { submitForm, TagData } = state.params;
    const buttonColor = Platform.OS === 'ios' ? '#ffffff' : '#000000'

    return {
      headerTitle: 'New Tag',
      headerRight: (<Button title="Save" color={buttonColor} onPress={() => submitForm()} />),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      description: '',
      img: 'string',
      crossed_out: false,
      date_taken: new Date(),
      gang_related: false,
      neighborhood: '',
      racially_motivated: false,
      square_footage: '',
      surface: 'string',
      tag_words: '',
      tag_initials: '',
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ 
      submitForm: this.submitForm.bind(this), 
      ...this.props.navigation.params
    });
  }

  componentDidMount() {
    this.setState({
      neighborhood: this.props.navigation.state.params.address.neighborhood,
    });
  }

  submitForm() {
    const { address } = this.props.navigation.state.params;
    const tagParams = Object.assign({}, this.state);
    const imagePath = this.props.navigation.state.params.imgData.path;

    if(!tagParams.description) {
      alert('Description must be filled out');
      return;
    }

    AzureImageUpload.uploadImage(imagePath)
      .then(response => {
        realm.write(() => {
          tagParams.img = response.name;
          address.tags.push(tagParams);
        });

        const addressViewReRoute = NavigationActions.reset({
          index: 2,
          actions: [
            NavigationActions.navigate({ routeName: 'Home'}),
            NavigationActions.navigate({ routeName: 'AddressList', params: {neighborhood: address.neighborhood}}),
            NavigationActions.navigate({ routeName: 'AddressView', params: {address}}),
          ]
        })

        this.props.navigation.dispatch(addressViewReRoute);
      });
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <Image 
          style={{width: win.width, height: 200}}
          source={{uri: this.props.navigation.state.params.imgData.path}}
        /> 
        <View style={{padding: 20 }}>
          <Text>Short Description</Text>
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
