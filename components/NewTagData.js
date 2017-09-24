import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  StatusBar,
  TabBarIOS,
  TextInput,
  Image,
  Dimensions,
  TabBarIOSItem
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';

import BaseView from './BaseView';

const win = Dimensions.get('window');



export default class NewTagData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
      neighborhood: ''
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
    this.props.navigator.popToTop();
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 64}}>
        <View style={{padding: 20 }}>
          <Text>Tag</Text>
          <Image 
            style={{width: win.width - 40, height: 200, marginTop: 10, marginBottom: 10}}
            source={{uri: 'https://linapps.s3.amazonaws.com/linapps/photomojo/wishtv.com/photos/2014/08/g13819/257599-bb68d.jpg'}} 
          /> 
          <Text>Tag Description</Text>
          <TextInput style={styles.input} defaultValue={''}/>
          <Text>Square Photage</Text>
          <TextInput style={styles.input} defaultValue={''} />
          <Text>Neighborhood</Text>
          <TextInput style={styles.input} value={this.state.neighborhood} />
          <Text>Describe the words of this Tag</Text>
          <TextInput multiline={true} style={styles.input} defaultValue={''} />
        </View>
        <TabBarIOS
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black">
         <TabBarIOS.Item
            iconName=""
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            selected={this.state.selectedTab === 'redTab'}>
            <Text></Text>
          </TabBarIOS.Item>
        </TabBarIOS>
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
