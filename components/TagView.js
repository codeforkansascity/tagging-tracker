import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation'

import realm from '../realm';
import BaseView from './BaseView';
import ItemCardView from './android/ItemCardView';
import IOSDivider from './ios/Divider';
import * as SessionSelectors from '../services/session/selectors';

const win = Dimensions.get('window');

export default class TagView extends Component {
  static navigationOptions = ({navigation}) => {
    let options = {}

    if (SessionSelectors.get().tokens.access.value) {
      options.headerRight =
        <Icon style={
            {
              color: '#ffffff',
              padding: 10,
              textShadowColor: '#000000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 0,
            }
          }
          name="md-trash"
          size={30}
          onPress={navigation.state.params.deleteTagPrompt}
        />;
    }

    if(Platform.OS === 'ios') {
      options.headerStyle = {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
      };

      options.headerTitleStyle = {
        textShadowColor: '#000000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 0
      };
    }

    return options;
  };

  componentWillMount() {
    this.props.navigation.setParams({ deleteTagPrompt: this.deleteTagPrompt.bind(this), ...this.props.navigation.params });
  }

  deleteTagPrompt() {
    Alert.alert(
      'Delete Tag?',
      null,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: this.deleteTag.bind(this)},
      ],
      { cancelable: false }
    );
  }

  deleteTag() {
    const { tag } = this.props.navigation.state.params;
    realm.write(() => {
      realm.delete(tag);
    });

    this.props.navigation.dispatch(NavigationActions.back());
  }

  render() {
    const { tag } = this.props.navigation.state.params;
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
      imageView = <ItemCardView imgSrc={tag.img} title={tag.description} />;
    } else {
      imageView = <Image style={{width: win.width, height: 400}} source={{uri: tag.img}} />;
      stylesHash.bodyText.fontSize = 17;
    }

    const styles = StyleSheet.create(stylesHash);

    return (
      <ScrollView style={{flex: 1}}>
        {imageView}
        <View style={{padding: 20 }}>
          {Platform.OS === 'ios' && <Text style={styles.mainTitle}>{tag.description}</Text>}
          {Platform.OS === 'ios' && <IOSDivider></IOSDivider>}
          <Text style={styles.title}>Neighborhood</Text>
          <Text style={styles.bodyText}>{tag.neighborhood}</Text>
          <Text style={styles.title}>Square Photage</Text>
          <Text style={styles.bodyText}>{tag.square_footage}</Text>
          <Text style={styles.title}>Tag Words</Text>
          <Text style={styles.bodyText}>{tag.tag_words}</Text>
        </View>
      </ScrollView>
    );
  }
}
