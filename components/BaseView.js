import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  TextInput,
  FlatList,
  ListItem,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';

import TagPhoto from './TagPhoto';
import TagList from './TagList';
import realm from '../realm';
import store from '../store';

export default class BaseView extends Component {
  static navigationOptions = {
    title: 'Tagging Tracker',
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
      neighborhoods: [],
      tags: [],
    };
  }

  _handleBackPress() {
    this.props.navigator.pop();
  }

  componentWillMount() {
    let tags = realm.objects('Tag');

    this.setState({
      tags
    });
  }

  alphabetizeNeighborhoods(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
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

  keyExtractor(item, index) {
    return item.id;
  }

  getNeighborhoods() {
    const currentNeighborhoods = [];

    return this.state.tags
        .map(tag => ({name: tag.neighborhood}))
        .filter(neighborhood => {
          if (currentNeighborhoods.includes(neighborhood.name)) {
            return false;
          } else {
            currentNeighborhoods.push(neighborhood.name);
            return true;
          }
        });
  }

  render() {
    const nextRoute = {
      component: TagPhoto,
      title: '',
      passProps: { myProp: 'bar' }
    };

    const neighborhoods = Array.from(new Set(this.state.tags.map(tag => ({name: tag.neighborhood}))));
    const { navigate } = this.props.navigation;

    return(
      <View style={{flex: 1, marginTop: 0}}>
        <View style={{flex: 14}}>
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.getNeighborhoods()}
            renderItem={({item}) => {
                return (
                  <Text key={item.name} style={styles.listItem} onPress={() => {this.props.navigation.navigate('TagList', {neighborhood: item.name})}} >{item.name}</Text> 
                )
              }
            }
            keyExtractor={this.keyExtractor}
          />
        </View>
        <TabNavigator
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black"
          >
          <TabNavigator.Item
            title="Add Tag"
            renderIcon={() => <Icon name="ios-camera" size={30}
            style={{backgroundColor: '#00000000'}}
            onPress={() => {navigate('TagPhoto');}}
             />}
            >
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    borderTopColor: '#dddddd'
  },
});