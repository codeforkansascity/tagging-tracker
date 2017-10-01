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

import TagPhoto from './TagPhoto';
import realm from '../realm';
import TagView from './TagView'

export default class TagList extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.neighborhood
    };
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { neighborhood } = this.props.navigation.state.params;
    let tags = realm.objects('Tag').filtered('neighborhood = $0', neighborhood);

    this.setState({
      tags
    });
  }

  _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
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
    return(
      <View style={{flex: 1, marginTop: 0}}>
        <View style={{flex: 14}}>
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.state.tags}
            renderItem={({item}) => {
                return (
                  <Text style={styles.listItem} onPress={() => {this.props.navigation.navigate('TagView', {tag: item})}} >{item.description}</Text> 
                )
              }
            }
            keyExtractor={this.keyExtractor}
          />
        </View>
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