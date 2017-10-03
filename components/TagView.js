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
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.tag.description
    };
  };

  render() {
    const { tag } = this.props.navigation.state.params;

    return (
      <View style={{flex: 1}}>
        <Image
          style={{width: win.width, height: 200}}
          source={{uri: tag.img}} 
        />
        <View style={{padding: 20 }}>
          <Text>Tag</Text>
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
