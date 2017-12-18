import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  TabBarIOS
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTagData from './NewTagData';

export default class TagPhoto extends Component {
  render() {
    return (
      <View style={cameraStyles.container}>
        <Camera
          captureTarget={Camera.constants.CaptureTarget.disk}
          ref={(cam) => {
            this.camera = cam;
          }}
          style={cameraStyles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={{padding: 10, backgroundColor: '#000000', color: '#ffffff'}} onPress={this.takePicture.bind(this)}>
            <Icon name="ios-aperture" size={30}/>
          </Text>
        </Camera>
      </View>
    );
  }

  takePicture() {
    const { navigate, state } = this.props.navigation;
    const { address, neighborhood } = state.params;

    this.camera.capture()
      .then((data) => {
        navigate(
          'NewTagData',
          {
            imgData: data,
            address,
            neighborhood
          }
        );
      })
  }
}

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
