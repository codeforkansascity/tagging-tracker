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

export default class BadInstagramExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
    };
  }

  _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }

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
    const options = {};
    const nextRoute = {
      component: NewTagData,
      title: 'New Tag',
      passProps: {
        ref: (component) => {this.pushedComponent = component},
      },
      onRightButtonPress: () => {
        // call func
        this.pushedComponent && this.pushedComponent.submitForm();
      },
      data: {},
      rightButtonTitle: 'Submit'
    };

    this.camera.capture()
      .then((data) => {
        nextRoute.passProps.data = data;
        this._handleNextPress(nextRoute);
      })
      .catch(err => console.error(err));
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
