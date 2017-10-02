import React, { Component } from 'react';
import { Text } from 'react-native';

class TagsGallery extends Component {
  render() {
    const neighborhood = this.props.navigation.state.params.neighborhood;
    const { title: neighborhoodTitle } = neighborhood;
    return <Text>{neighborhoodTitle}</Text>;
  }
}

export default TagsGallery;
