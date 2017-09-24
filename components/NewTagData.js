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
  Dimensions
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';

import BaseView from './BaseView';

const win = Dimensions.get('window');

export default class NewTagData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
    };
  }

  componentWillMount() {
    this.props.navigator.title = "Home";

    this.props.navigator.rightNavButton = {
        text: "Button",
        onPress: () => {alert('You submitted the form!')}
    };
  }

  submitForm() {
    this.props.navigator.popToTop();
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 64}}>
        <View style={{padding: 20 }}>
          <Text>Tag</Text>
          <Image 
            style={{width: win.width - 40, height: 200, marginTop: 10, marginBottom: 10}}
            source={{uri: 'https://linapps.s3.amazonaws.com/linapps/photomojo/wishtv.com/photos/2014/08/g13819/257599-bb68d.jpg'}} 
          /> 
          <Text>Tag Description</Text>
          <TextInput style={styles.input} defaultValue={''}/>
          <Text>Square Photage</Text>
          <TextInput style={styles.input} defaultValue={''} />
          <Text>Describe the words of this Tag</Text>
          <TextInput multiline={true} style={styles.input} defaultValue={''} />
        </View>
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

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginBottom: 10,
    marginTop: 5,
    color: '#0000ff'
  }
});
