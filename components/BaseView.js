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

  render() {
    const nextRoute = {
      component: BadInstagramExample,
      title: '',
      passProps: { myProp: 'bar' }
    };

    return(
      <View style={{flex: 1, marginTop: 0}}>
        <View style={{flex: 14}}>
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.state.tags}
            renderItem={({item}) => {
                const nextRoute = {
                  component: TagList,
                  title: item.neighborhood,
                  passProps: { neighborhood: item.neighborhood }
                };

                return (
                  <Text style={styles.listItem} onPress={() => this._handleNextPress(nextRoute)} >{item.neighborhood}</Text> 
                )
              }
            }
            keyExtractor={this.keyExtractor}
          />
        </View>
        <TabBarIOS
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black">
         <Icon.TabBarItemIOS
            iconName="ios-camera"
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
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