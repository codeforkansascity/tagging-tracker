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
import shortid from 'shortid';

import TagPhoto from './TagPhoto';
import realm from '../realm';
import TagView from './TagView';

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
            keyExtractor={item => shortid.generate()}
            renderItem={({item}) => {
                return (
                  <View style={styles.listItem}>
                    <Image style={{width: 30, height: 30, borderRadius: 15, marginRight: 10}} source={{uri: `https://cdn.pixabay.com/photo/2016/03/28/12/35/cat-1285634_1280.png`}} />
                    <Text style={{alignContent: 'center', textAlignVertical: 'center'}} onPress={() => {this.props.navigation.navigate('TagView', {tag: item})}} >
                      {item.description}
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
    padding: 5
  },
});
