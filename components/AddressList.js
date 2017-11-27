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
  ListItem,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import TagPhoto from './TagPhoto';
import realm from '../realm';
import TagView from './TagView'

export default class AddressList extends Component {
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
    let addresses = realm.objects('Address').filtered('neighborhood = $0', neighborhood);

    this.setState({
      addresses
    });
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
            data={this.state.addresses}
            renderItem={({item}) => {
                return (
                  <View style={styles.listItem}>
                    <Text style={{alignContent: 'center', textAlignVertical: 'center'}} onPress={() => {this.props.navigation.navigate('AddressView', {address: item})}} >
                      {item.street}
                    </Text>
                  </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10
  },
});
