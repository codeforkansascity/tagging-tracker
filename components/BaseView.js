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
  FlatList,
  ListItem
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import BadInstagramExample from './BadInstagramExample';
import TabNavigator from 'react-native-tab-navigator';

import TagList from './TagList';
import realm from '../realm';

export default class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
      neighborhoods: []
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

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
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
      component: BadInstagramExample,
      title: '',
      passProps: { myProp: 'bar' }
    };

    const neighborhoods = Array.from(new Set(this.state.tags.map(tag => ({name: tag.neighborhood}))));

    return(
      <View style={{flex: 1, marginTop: 0}}>
        <View style={{flex: 14}}>
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.getNeighborhoods()}
            renderItem={({item}) => {
                const nextRoute = {
                  component: TagList,
                  title: item.name,
                  passProps: { neighborhood: item.name }
                };

                return (
                  <Text key={item.name} style={styles.listItem} onPress={() => this._handleNextPress(nextRoute)} >{item.name}</Text> 
                )
              }
            }
            keyExtractor={this.keyExtractor}
          />
        </View>
        <TabNavigator
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black">
          <TabNavigator.Item
            title="Add Tag"
            renderIcon={() => <Icon name="ios-camera" size={35} />}
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