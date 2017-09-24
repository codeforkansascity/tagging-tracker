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
    fetch('https://data.kcmo.org/api/geospatial/q45j-ejyk?method=export&format=GeoJSON')
      .then(response => response.json())
      .then((response) => {
        this.setState({
          neighborhoods: response.features.map(feature => {
            return {id: feature.properties.nbhid, name: feature.properties.nbhname}
          }).filter(neighborhood => {
            return neighborhood.name != null && neighborhood.name != undefined;
          }).sort(this.alphabetizeNeighborhoods)
        });
      }).
      catch((e) => { });
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
            data={this.state.neighborhoods}
            renderItem={({item}) => <Text style={styles.listItem}>{item.name}</Text> }
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