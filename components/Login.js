import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
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
} from 'react-native';

import Toast from 'react-native-simple-toast';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';
import { 
  NavigationActions,
  StackActions
 } from 'react-navigation';

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
    this.skipLogin = this.skipLogin.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ submitForm: this.submitForm.bind(this), ...this.props.navigation.params });
  }

  submitForm() {
    if (!this.state.email || !this.state.password) {
      Alert.alert(
        'Please enter your email and password to login.',
        null,
        [
          {text: 'OK', style: 'cancel'}
        ],
        { cancelable: true }
      );
      return;
    }

    authenticate(this.state.email, this.state.password)
      .then(this.navigateHome)
      .catch(response => {
        alert('Login failed. Please Double Check Credentials');
      });
  }

  skipLogin() {
    Alert.alert(
      'Data cannot be updated unless you are logged in',
      null,
      [
        {text: 'Login', style: 'cancel'},
        {text: 'Continue', onPress: this.navigateHome},
      ],
      { cancelable: false }
    );
  }

  navigateHome() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home', params: { initializingApp: true }})
      ]
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20}}>
        <View style={{flex: 1}}>
          <Text>Email</Text>
          <TextInput autoCapitalize="none" autoCorrect={false} style={styles.input} value={this.state.email} onChangeText={(email) => this.setState({email})} />
          <Text>Password</Text>
          <TextInput secureTextEntry autoCorrect={false} style={styles.input} value={this.state.password} onChangeText={(password) => this.setState({password})} />
          <Button title="Login" onPress={this.submitForm} />
        </View>
        <View style={{marginBottom: 10}}>
          <Button title="Skip" onPress={this.skipLogin} />
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
