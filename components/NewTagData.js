import React, { Component } from 'react';
import {
  ActivityIndicator,
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

import Toast from 'react-native-simple-toast';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';
import { NavigationActions } from 'react-navigation';

import BaseView from './BaseView';
import realm from '../realm';
import AzureImageUpload from '../util/AzureImageUpload';
import store from '../store';
import networkActions from '../services/network/actions';
import taggingTrackerActions from '../services/tagging_tracker/actions';
import * as networkSelectors from '../services/network/selectors';
import { uploadTag } from '../services/tagging_tracker';

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
      date_updated: new Date(),
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
    const { address, neighborhood }  = this.props.navigation.state.params;

    this.setState({
      neighborhood,
      address,
    });
  }

  submitForm() {
    let tag;
    let { address } = this.props.navigation.state.params;
    const tagParams = Object.assign({}, this.state);
    const imagePath = this.props.navigation.state.params.imgData.path;
    const userId = store.getState().session.user.id;

    if(!tagParams.description) {
      alert('Description must be filled out');
      return;
    }

    tagParams.img = imagePath;
    tagParams.creator_user_id = userId;
    tagParams.last_updated_user_id = userId;
    tagParams.address = address.toString();
    tagParams.uploaded_online = false;

    realm.write(() => {
      tag = realm.create('Tag', tagParams);
    });

    this.setState({
      updating: true
    });

    if(networkSelectors.get().isConnected) {
      AzureImageUpload.uploadImage(imagePath)
      .then(response => {
        realm.write(() => {
          tag.img = response.name;
        })

        return tag.serviceProperties;
      })
      .then(uploadTag)
      .then(response => {
        realm.write(() => {
          tag.id = response.data.id.toString();
          tag.address = response.data.address.toString();
          tag.uploaded_online = true;
        })
      })
      .then(this.submitDataSuccessNavigation.bind(this));
    } else {
      Toast.show('Phone is Offline. Data will be uploaded when phone is connected.');
      let request = { action: 'UPLOAD', type: 'Tag', entity: tag.serviceProperties };
      store.dispatch(taggingTrackerActions.addToQueue({ request }));
      this.submitDataSuccessNavigation();
    }
  }

  submitDataSuccessNavigation() {
    const { address, neighborhood } = this.props.navigation.state.params;

    const addressViewReRoute = NavigationActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: 'Home', params: { initializingApp: false }}),
        NavigationActions.navigate({ routeName: 'AddressList', params: { neighborhood }}),
        NavigationActions.navigate({ routeName: 'AddressView', params: { addressId: address }}),
      ]
    });

    this.props.navigation.dispatch(addressViewReRoute);
  }

  render() {
    if(this.state.updating) {
      return (<ActivityIndicator style={{flex: 1}} color="#000000" />);
    } else {
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
