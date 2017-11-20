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
import { NavigationActions } from 'react-navigation'

import BaseView from './BaseView';
import realm from '../realm';
import { authenticate } from '../services/session/'

const win = Dimensions.get('window');

export default class Login extends Component {
  static navigationOptions = ({navigation}) => {
    const { state } = navigation;

    if (state.params) {
      const { submitForm } = state.params;
      const buttonColor = Platform.OS === 'ios' ? '#ffffff' : '#000000'
      return {
        headerTitle: 'Sign In to Continue',
      };
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ submitForm: this.submitForm.bind(this), ...this.props.navigation.params });
  }

  submitForm() {
    authenticate(this.state.email, this.state.password)
      .then(response => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home'})
          ]
        });

        this.props.navigation.dispatch(resetAction);
      })
      .catch(response => {
        alert('Login failed. Please Double Check Credentials');
      });
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 20 }}>
          <Text>Email</Text>
          <TextInput autoCapitalize="none" style={styles.input} value={this.state.email} onChangeText={(email) => this.setState({email})} />
          <Text>Password</Text>
          <TextInput secureTextEntry style={styles.input} value={this.state.password} onChangeText={(password) => this.setState({password})} />
          <Button title="Login" onPress={this.submitForm} />
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
