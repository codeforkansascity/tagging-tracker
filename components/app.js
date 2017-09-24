import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import TagDetailsDialog from './TagDetailsDialog';
import TagDetailsEditDialog from './TagDetailsEditDialog';

const Navigator = StackNavigator({
  Home: { screen: TagDetailsDialog },
  TagDetailsEditDialog: { screen: TagDetailsEditDialog },
});

export default class App extends Component {
  render() {
    return (
      <Navigator />
    );
  }
}
