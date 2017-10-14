import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import EditTagModal from './EditTagModal';

const win = Dimensions.get('window');

const EditIcon = ({ onPress }) => (
  <Icon
    name="mode-edit"
    size={25}
    color="#fff"
    onPress={onPress}
  />);

export default class TagView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editDetailsModalOpen: false,
    };

    this.onEditSelected = this.onEditSelected.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.tag.description,
      headerRight: <EditIcon onPress={navigation.state.params.onEditSelected} />
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ onEditSelected: this.onEditSelected });
  }

  onEditSelected() {
    this.setState({
      editDetailsModalOpen: true,
    });
  }

  render() {
    const { tag } = this.props.navigation.state.params;

    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{ width: win.width, height: 200 }}
          source={{ uri: tag.img }}
        />
        <View style={{ padding: 20 }}>
          <Text>Tag</Text>
          <Text style={styles.title}>Square Footage</Text>
          <Text>{tag.square_footage}</Text>
          <Text style={styles.title}>Tag Words</Text>
          <Text>{tag.tag_words}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginBottom: 10,
    marginTop: 5,
    textDecorationLine: 'underline'
  }
});
