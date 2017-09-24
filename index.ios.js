/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  StatusBar,
  TabBarIOS
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import BadInstagramExample from './components/BadInstagramExample.js';

class MyView extends Component {
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
      title: 'Bar That',
      passProps: { myProp: 'bar' }
    };

    return(
      <View style={{flex: 1}}>
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

export default class TaggingTracker extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
        />
        <NavigatorIOS
          initialRoute={{
            component: MyView,
            title: 'Current Tags',
            statusBarHidden: true,
          }}
          style={{flex: 1}}
          barTintColor="#000000"
          tintColor="#ffffff"
          titleTextColor="#ffffff"
          renderScene={(route, navigator) =>
            <View>
              <StatusBar hidden={route.statusBarHidden} />
              ...
            </View>
           }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
AppRegistry.registerComponent('TaggingTracker', () => TaggingTracker);
