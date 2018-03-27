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
  ScrollView
} from 'react-native';

import Toast from 'react-native-simple-toast';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';
import { NavigationActions } from 'react-navigation';
import shortid from 'shortid';

import BaseView from './BaseView';
import realm from '../realm';
import AzureImageUpload from '../util/AzureImageUpload';
import store from '../store';
import networkActions from '../services/network/actions';
import taggingTrackerActions from '../services/tagging_tracker/actions';
import * as networkSelectors from '../services/network/selectors';
import { uploadTag } from '../services/tagging_tracker';
import { updateTag } from '../services/tagging_tracker';
import ItemCardView from './android/ItemCardView';
import IOSDivider from './ios/Divider';

const win = Dimensions.get('window');

export default class TagEdit extends Component {

  // static navigationOptions = ({navigation}) => {
  //   const { state } = navigation;
  //   const { submitForm, TagData } = state.params;
  //   const buttonColor = Platform.OS === 'ios' ? '#ffffff' : '#000000'

  //   return {
  //     headerTitle: 'Edit Tag',
  //     headerRight: (<Button title="Save" color={buttonColor} onPress={() => submitForm()} />),
  //   };
  // };

  constructor(props) {
    super(props);
    this.closeTagEditModal = this.closeTagEditModal.bind(this);

    this.state = {
      tag: null,
      description: '',
      square_footage: '',
      neighborhood: '',
      tag_words: '',
      img: '',
      updating: false
    };
  }

  componentWillMount() {
    this.setState({
      tag: this.props.tag,
      description: this.props.tag.description,
      square_footage: this.props.tag.square_footage,
      neighborhood: this.props.tag.neighborhood,
      tag_words: this.props.tag.tag_words,
      img: this.props.tag.img,
    });
  }

  closeTagEditModal() {
    this.props.editTagModal(false);
  }

  saveForm() {
    const userId = store.getState().session.user.id;

    // let tag;
    // let { address } = this.props.navigation.state.params;
    // const tagParams = Object.assign({}, this.state);
    // const imagePath = this.props.navigation.state.params.imgData.path;
    // const userId = store.getState().session.user.id;

    // if (!tagParams.description) {
    //   alert('Description must be filled out');
    //   return;
    // }

    // tagParams.id = tag.id
    // tagParams.img = imagePath;
    // tagParams.local_img = imagePath;
    // tagParams.creator_user_id = userId;
    // tagParams.last_updated_user_id = userId;
    // tagParams.address = address.toString();
    // tagParams.uploaded_online = false;

    // this.setState({
    //   updating: true
    // });

    // realm.write(() => {
    //   tag = realm.create('Tag', tagParams);
    // });

    // if (networkSelectors.get().isConnected) {
    //   AzureImageUpload.uploadImage(imagePath)
    //   .then(response => {
    //     realm.write(() => {
    //       tag.img = response.name;
    //     })

    //     return tag.serviceProperties;
    //   })
    //   .then(uploadTag)
    //   .then(response => {
    //     realm.write(() => {
    //       let tag = response.data;
    //       tag.id = response.data.id.toString();
    //       tag.address = response.data.address.toString();
    //       tag.uploaded_online = true;
    //     })
    //   })
    //   .then(this.submitDataSuccessNavigation.bind(this));
    // } else {
    //   Toast.show('Phone is Offline. Data will be uploaded when phone is connected.');

    //   let request = {
    //     action: 'UPLOAD',
    //     type: 'Tag',
    //     entity: tag.serviceProperties,
    //     local_img: tag.local_img,
    //     address_uploaded: address.uploaded_online
    //   };

    //   store.dispatch(taggingTrackerActions.addToQueue({ request }));
    //   this.submitDataSuccessNavigation();
    // }


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

    if (this.state.updating) {
      return (<ActivityIndicator style={{flex: 1}} color="#000000" />);
    } else {

      const stylesHash = {
        mainTitle: {
          fontSize: 34,
          marginBottom: 10,
        },
        title: {
          fontSize: 28,
          marginBottom: 10,
          marginTop: 5,
        },
        bodyText: {
          fontSize: 20,
          marginBottom: 20,
        }
      };

      let imageView;

      if(Platform.OS === 'android') {
        imageView = <ItemCardView imgSrc={this.state.tag.img} title={this.state.tag.description} />;
      } else {
        imageView = <Image style={{width: this.getScreenWidth, height: 400}} source={{uri: this.state.tag.img}} />;
        stylesHash.bodyText.fontSize = 17;
      }

      return (
        <ScrollView style={{flex: 1}}>

          <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 20, borderRadius: 2 }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10}}>
              <Text style={{fontSize: 20}} onPress={this.closeTagEditModal}>Close</Text>
              <Text style={{fontSize: 20}} onPress={this.saveForm}>Save</Text>
            </View>

            {imageView}

            {Platform.OS === 'ios' && <IOSDivider></IOSDivider>}
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
