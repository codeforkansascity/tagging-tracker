import React, { Component } from 'react';
import {
  ActivityIndicator,
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
import { connect } from 'react-redux';
import shortid from 'shortid';
import TabNavigator from 'react-native-tab-navigator';
import { 
  NavigationActions,
  StackActions
 } from 'react-navigation';
import Toast from 'react-native-simple-toast';

import realm from '../realm';
import BaseView from './BaseView';
import ItemCardView from './android/ItemCardView';
import IOSDivider from './ios/Divider';
import * as SessionSelectors from '../services/session/selectors';
import * as NetworkSelectors from '../services/network/selectors';
import * as TaggingTrackerSelectors from '../services/network/selectors'
import { uploadSavedTasks } from '../services/tagging_tracker/offline_upload';
import store from '../store'
import Notification from '../util/Notification';
import * as NotificationActions from '../actions/notifications';
import NativeIonicon from './common_ui/NativeIonicon';

const win = Dimensions.get('window');

class Notifications extends Component {
  static navigationOptions = {title: 'Notifications'};

  constructor(props) {
    super(props);

    this.state = {
      isUploading: false,
    }

    this.loadData = this.loadData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.taskCompletedCount === store.getState().notifications.length && this.state.isUploading) {
      this.setState({
        isUploading: false
      });
    }
  }

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

  loadData() {
    if (!NetworkSelectors.get().isConnected) {
      Toast.show('No connectivity found.')
      return;
    }

    uploadSavedTasks();
    Toast.show("Uploading Data. Check Back Later to see it's status.");
      const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }

  renderNotificationList() {
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

              if (item.type === Notification.AlertTypes.SUCCESS) {
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

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.isUploading && <ActivityIndicator style={{flex: 1}} />}
        {!this.state.isUploading && this.renderNotificationList()}
        <TabNavigator
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black"
          >
          <TabNavigator.Item
            title="Retry Online Upload"
            onPress={this.loadData}
            renderIcon={() => <NativeIonicon name="refresh-circle" size={22} />}
          />
        </TabNavigator>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  taskCompletedCount: state.tagging_tracker.taskCompletedCount,
});

export default connect(
  mapStateToProps
)(Notifications);
