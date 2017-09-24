import React, { Component } from 'react';
import { View, Button } from 'react-native';

class TagDetailsDialog extends Component {
  static navigationOptions = {
    title: 'View Tags',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Button
          onPress={() => navigate('TagDetailsEditDialog')}
          title="Edit Tags"
        />
      </View>
    );
  }
}

export default TagDetailsDialog;
