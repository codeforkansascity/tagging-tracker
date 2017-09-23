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
  StatusBar
} from 'react-native';

class MyView extends Component {
  _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }

  render() {
    const nextRoute = {
      component: MyView,
      title: 'Bar That',
      passProps: { myProp: 'bar' }
    };
    return(
      <TouchableHighlight>
        <Text style={{marginTop: 200, alignSelf: 'center'}}>
          See you on the other nav {this.props.myProp}!
        </Text>
      </TouchableHighlight>
    );
  }
}

export default class TaggingTracker extends Component {
  _handleNavigationRequest() {
    this.refs.nav.push({
      component: MyView,
      title: 'Tagging Tracker',
      passProps: { myProp: 'genius' },
    });
  }

  render() {
    return (
      <View>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <NavigatorIOS
          ref='nav'
          initialRoute={{
            component: MyView,
            title: 'Tagging Tracker',
            passProps: { myProp: 'foo' },
            rightButtonTitle: 'Add',
            onRightButtonPress: () => this._handleNavigationRequest(),
          }}
          styles={styles}
          barTintColor='#000000'
          titleTextColor='#fff'
          tintColor='#fff'
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
