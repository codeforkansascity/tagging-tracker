import React, { Component } from 'react';
import {
  Alert,
  Animated,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import Modal from 'react-native-modal';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation'

import BaseView from './BaseView';
import TagEdit from './TagEdit';
import ItemCardView from './android/ItemCardView';
import IOSDivider from './ios/Divider';
import * as SessionSelectors from '../services/session/selectors';

const win = Dimensions.get('window');

export default class TagView extends Component {

  static navigationOptions = ({navigation}) => {
    let options = {}

    if (SessionSelectors.get().tokens.access.value) {
      options.headerRight =
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon style={
              {
                color: '#ffffff',
                padding: 10,
                textShadowColor: '#000000',
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 0,
              }
            }
            name="md-create"
            size={30}
            onPress={navigation.state.params.editTag}
          />
          <Icon style={
              {
                color: '#ffffff',
                padding: 10,
                textShadowColor: '#000000',
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 0,
              }
            }
            name="md-trash"
            size={30}
            onPress={navigation.state.params.deleteTagPrompt}
          />
        </View>;
    }

    if (Platform.OS === 'ios') {
      options.headerStyle = {
        position: 'absolute',
        backgroundColor: !navigation.state.params? 'transparent' : navigation.state.params.bgColor,
        borderBottomColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
      };

      options.headerTitleStyle = {
        textShadowColor: '#000000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 0
      };
    }

    return options;
  };

  constructor(props) {
    super(props);
    this.scrollY = new Animated.Value(0);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      deleteTagPrompt: this.deleteTagPrompt.bind(this),
      bgColor: this.scrollY.interpolate({
        inputRange: [0, win.height / 2 - 40],
        outputRange: ['transparent', 'rgb(0, 0,0)'],
        extrapolate: 'clamp',
      }),
      editTag: this.editTag.bind(this),
      ...this.props.navigation.params,
    });

    this.setState({editTagModal: false});
  }

  deleteTagPrompt() {
    Alert.alert(
      'Delete Tag?',
      null,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: this.deleteTag.bind(this)},
      ],
      { cancelable: false }
    );
  }

  deleteTag() {
    const { tag, deleteCurrentTag } = this.props.navigation.state.params;
    deleteCurrentTag(tag);
    this.props.navigation.dispatch(NavigationActions.back());
  }

  editTag() {
    this.setState({editTagModal: true});
  }

  editMode = value => {
    this.setState({editTagModal: value});
  };

  render() {
    const { tag } = this.props.navigation.state.params;

    const stylesHash = {
      mainTitle: {
        fontSize: 34,
        marginBottom: 10,
      },
      title: {
        fontSize: 28,
        marginBottom: 10,
        marginTop: 5,
      },
      bodyText: {
        fontSize: 20,
        marginBottom: 20,
      }
    };

    let imageView;

    if(Platform.OS === 'android') {
      imageView = <ItemCardView imgSrc={tag.img} title={tag.description} />;
    } else {
      imageView = <Image style={{width: win.width, height: 400}} source={{uri: tag.img}} />;
      stylesHash.bodyText.fontSize = 17;
    }

    const styles = StyleSheet.create(stylesHash);

    return (
      <ScrollView
        bounces={false}
        style={{flex: 1}}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: this.scrollY } } },
        ])}
        scrollEventThrottle={16}
      >

      <Modal
        isVisible={this.state.editTagModal}
        backdropColor='#000000'
        onBackdropPress={() => {this.setState({editTagModal: false})}}
        transparent
      >
        <TagEdit tag={this.props.navigation.state.params.tag} editTagModal={this.editMode} />
      </Modal>

        {imageView}
        <View style={{padding: 20 }}>
          {Platform.OS === 'ios' && <Text style={styles.mainTitle}>{tag.description}</Text>}
          {Platform.OS === 'ios' && <IOSDivider></IOSDivider>}
          <Text style={styles.title}>Neighborhood</Text>
          <Text style={styles.bodyText}>{tag.neighborhood}</Text>
          <Text style={styles.title}>Square Footage</Text>
          <Text style={styles.bodyText}>{tag.square_footage}</Text>
          <Text style={styles.title}>Tag Words</Text>
          <Text style={styles.bodyText}>{tag.tag_words}</Text>
        </View>

      </ScrollView>
    );
  }
}
