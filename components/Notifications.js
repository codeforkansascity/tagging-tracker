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
  FlatList,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import shortid from 'shortid';
import { NavigationActions } from 'react-navigation';

import realm from '../realm';
import BaseView from './BaseView';
import ItemCardView from './android/ItemCardView';
import IOSDivider from './ios/Divider';
import * as SessionSelectors from '../services/session/selectors';
import store from '../store'
import Notification from '../util/Notification';
import * as NotificationActions from '../actions/notifications';

const win = Dimensions.get('window');

export default class Notifications extends Component {
  static navigationOptions = {title: 'Notifications'};

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  getNotifications() {
    const { notifications } = store.getState().notifications;
    return notifications;
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <FlatList
          ItemSeparatorComponent={this.renderSeparator}
          data={this.getNotifications()}
          keyExtractor={item => shortid.generate()}
          renderItem={({item}) => 
            {
              store.dispatch(NotificationActions.deleteNotification({notification: item}));
              let itemStyles = {
                padding: 10,
                color: '#FFFFFF',
              };

              if (item.type == Notification.AlertTypes.SUCCESS) {
                itemStyles.backgroundColor = '#30ad63';
              } else {
                itemStyles.backgroundColor = '#b63233';
              }

              return (
                <View>
                  <Text style={itemStyles}>
                    {item.message}
                  </Text> 
                </View>
              );
            }
          }
        />
      </ScrollView>
    );
  }
}
