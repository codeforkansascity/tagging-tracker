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
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';

import BaseView from './BaseView';

const win = Dimensions.get('window');

export default class TagView extends Component {
  render() {
    let tag = this.props.tag;

    return (
      <View style={{flex: 1, marginTop: 64}}>
        <View style={{padding: 20 }}>
          <Text>Tag</Text>
          <Image 
            style={{width: win.width - 40, height: 200, marginTop: 10, marginBottom: 10}}
            source={{uri: tag.img}} 
          /> 
          <Text style={styles.title}>Square Photage</Text>
          <Text>{tag.square_footage}</Text>
          <Text style={styles.title}>Tag Words</Text>
          <Text>{tag.tag_words}</Text>
        </View>
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
