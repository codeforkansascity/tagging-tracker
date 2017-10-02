import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import BaseView from './BaseView';
import TagsGallery from './TagsGallery';
import BadInstagramExample from './BadInstagramExample';
import TagDetailsEditDialog from './TagDetailsEditDialog';

const Navigator = StackNavigator({
  Home: { screen: BaseView },
  TagDetailsEditDialog: { screen: TagDetailsEditDialog },
  TagsGallery: { screen: TagsGallery },
  CameraView: { screen: BadInstagramExample },
});

export default class App extends Component {
  render() {
    return (
      <Navigator />
    );
  }
}
