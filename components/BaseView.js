import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
} from 'react-native';

import BadInstagramExample from './BadInstagramExample';
import TagList from './TagList'

export default class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
      neighborhoods: []
    };

    this.onNeighborhoodSelection = this.onNeighborhoodSelection.bind(this);
    this.onCreateTagPress = this.onCreateTagPress.bind(this);
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

  onCreateTagPress() {
    this.props.navigation.navigate('CameraView');
  }

  onNeighborhoodSelection(neighborhood) {
    this.props.navigation.navigate('TagsGallery', { neighborhood });
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

  keyExtractor(item) {
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
          <Button title={'Create Tag'} onPress={this.onCreateTagPress} />
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.state.neighborhoods}
            renderItem={({item}) => {
                const neighborhood = {
                  component: TagList,
                  title: item.name,
                  passProps: { myProp: 'bar' }
                };

                return (
                  <Text style={styles.listItem} onPress={() => this.onNeighborhoodSelection(neighborhood)} >{item.name}</Text>
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