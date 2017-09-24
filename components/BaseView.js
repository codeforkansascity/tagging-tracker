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
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import BadInstagramExample from './BadInstagramExample';

export default class BaseView extends Component {
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
    const nextRoute = {
      component: BadInstagramExample,
      title: '',
      passProps: { myProp: 'bar' }
    };

    return(
      <View style={{flex: 1, marginTop: 64}}>
        <TabBarIOS
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black">
         <Icon.TabBarItemIOS
            iconName="ios-camera"
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this._handleNextPress(nextRoute);
            }}>
            <Text></Text>
          </Icon.TabBarItemIOS>
        </TabBarIOS>
      </View>
    );
  }
}
