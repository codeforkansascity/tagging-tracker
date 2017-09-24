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

import BaseView from './BaseView';

const win = Dimensions.get('window');

export default class TagView extends Component {
  render() {
    return (
      <View style={{flex: 1, marginTop: 64}}>
        <View style={{padding: 20 }}>
          <Text>Tag</Text>
          <Image 
            style={{width: win.width - 40, height: 200, marginTop: 10, marginBottom: 10}}
            source={{uri: 'https://linapps.s3.amazonaws.com/linapps/photomojo/wishtv.com/photos/2014/08/g13819/257599-bb68d.jpg'}} 
          /> 
          <Text style={styles.title}>Square Photage</Text>
          <Text>5' x 4'</Text>
          <Text style={styles.title}>Describe the words of this Tag</Text>
          <Text>This has a lot of strange words on it, but I can see lots of F word profanities on this tag.</Text>
        </View>
        <TabBarIOS
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black">
         <TabBarIOS.Item
            iconName="ios-camera">
            <Text></Text>
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginBottom: 10,
    marginTop: 5,
    textDecorationLine: 'underline'
  }
});
