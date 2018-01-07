import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import Modal from 'react-native-modal';
import TabNavigator from 'react-native-tab-navigator';
import { NavigationActions } from 'react-navigation';

import realm from '../realm';
import Address from '../realm/address';
import BaseView from './BaseView';
import ItemCardView from './android/ItemCardView';
import IOSDivider from './ios/Divider';
import NativeIonicon from './common_ui/NativeIonicon';
import * as SessionSelectors from '../services/session/selectors';
import * as NetworkSelectors from '../services/network/selectors';
import { deleteAddress, deleteTag } from '../services/tagging_tracker';


const win = Dimensions.get('window');

const modalContentStyles = {
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

export default class AddressView extends Component {
  static navigationOptions = ({navigation}) => {
    let options = {}
    options.title = navigation.state.params.address && navigation.state.params.address.street;
    return options;
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.closeAddressDetailsModal = this.closeAddressDetailsModal.bind(this);
    this.deleteCurrentTag = this.deleteCurrentTag.bind(this);
    this.deleteAddressPrompt = this.deleteAddressPrompt.bind(this);
  }

  componentWillMount() {
    let address = realm.objects('Address').filtered('id = $0', this.props.navigation.state.params.addressId);

    if (address) {
      address = address[0];
    }

    this.props.navigation.setParams({
      address,
      ...this.props.navigation.params
    });
  }

  deleteAddressPrompt() {
    if(NetworkSelectors.get().isConnected) {
      Alert.alert(
        'Delete Address?',
        null,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Delete', onPress: this.deleteCurrentAddress.bind(this)},
        ],
        { cancelable: false }
      );
    } else {
      alert('You must be online to delete any data')
    }
  }

  deleteCurrentAddress() {
    const { address } = this.props.navigation.state.params;
    const neighborhood = address.neighborhood;

    this.setState({
      deletingAddress: true
    });

    deleteAddress(address.id)
      .then(() => {
        realm.write(() => {
          realm.delete(realm.objects('Tag').filtered('address = $0', address.id));
          realm.delete(realm.objects('Address').filtered('id = $0', address.id));
        });

        const addressListing = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'Home'}),
            NavigationActions.navigate({ routeName: 'AddressList', params: {neighborhood}}),
          ]
        })

        this.props.navigation.dispatch(addressListing);
      });
  }

  addTag() {
    const { navigate, state } = this.props.navigation;
    const { address } = state.params;

    navigate('TagPhoto', { address: address.id, neighborhood: address.neighborhood });
  }

  deleteTagConfirm(tag) {
    if(NetworkSelectors.get().isConnected) {
      Alert.alert(
        'Delete Tag?',
        null,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Delete', onPress: () => {this.deleteCurrentTag(tag)}},
        ],
        { cancelable: false }
      );
    } else {
      alert('You must be online to delete any data')
    }
  }

  deleteCurrentTag(tag) {
    this.setState({
      deletingTag: tag.id
    });

    deleteTag(tag.id)
      .then(() => {
        realm.write(() => {
          realm.delete(tag);
          this.forceUpdate();
        });
      })
      .finally(response => {
        this.setState({
          deletingTag: null
        });
      })
  }

  renderTagComponent(tag) {
    if(this.state.deletingTag == tag.id) {
      return (<ActivityIndicator style={{padding: 20}}/>);
    } else {
      return (
        <View style={{padding: 10}}>
          <TouchableHighlight
            onPress={() => {this.props.navigation.navigate('TagView', {tag, deleteCurrentTag: this.deleteCurrentTag})}}
          >
            <Image 
              style={{width: win.width - 20, height: 200}} 
              source={{uri: tag.img}} 
            />
          </TouchableHighlight>
          <View 
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text style={{
              flex: 1, 
              justifyContent: 'center',
              marginTop: 5}}
            >
              {tag.description}
            </Text>
            {SessionSelectors.get().tokens.access.value && (
              <NativeIonicon style={
                {
                  color: '#FF0505',
                  alignSelf: 'flex-end',
                }
              }
              name="trash"
              size={24}
              onPress={() => {this.deleteTagConfirm(tag)}}
            />)}
          </View>
        </View>
      );
    }
  }

  renderNoTagSection() {
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={this.state.addressDetailsViewable}
          backdropColor='#000000'
          onBackdropPress={() => {this.setState({addressDetailsViewable: false})}}
          transparent
        >
          {this.renderAddressDetails(this.props.navigation.state.params.address)}
        </Modal>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={this.addTag.bind(this)}>
          <View onPress={this.addTag.bind(this)} style={{flexDirection: 'column', alignItems: 'center', padding: 20, flex: 1}}>
            <NativeIonicon name="camera" size={100} />
            <Text style={{fontSize: 30}}>Add Tag</Text>
          </View>
        </TouchableWithoutFeedback>
        <TabNavigator
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black"
          >
          <TabNavigator.Item
            title="Info"
            onPress={() => {this.setState({addressDetailsViewable: true})}}
            renderIcon={
              () => <NativeIonicon name="information-circle" size={24} style={{backgroundColor: '#00000000'}} />
            }
          />
          {SessionSelectors.get().tokens.access.value && (
            <TabNavigator.Item
              title="Delete"
              renderIcon={() =>
                <NativeIonicon name="trash" size={24} />
              }
              onPress={this.deleteAddressPrompt}
            />)}
        </TabNavigator>
      </View>
    );
  }

  renderTagsSection(tags) {
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={this.state.addressDetailsViewable}
          backdropColor='#000000'
          onBackdropPress={() => {this.setState({addressDetailsViewable: false})}}
          transparent
        >
          {this.renderAddressDetails(this.props.navigation.state.params.address)}
        </Modal>
        <ScrollView>
          {tags.map(this.renderTagComponent.bind(this))}
          <View style={{height: 50}}></View>
        </ScrollView>
        <TabNavigator
          unselectedTintColor="yellow"
          tintColor="white"
          barTintColor="black"
          >
          <TabNavigator.Item
            title="Add Tag"
            onPress={this.addTag.bind(this)}
            renderIcon={() => <NativeIonicon name="camera" size={30} style={{backgroundColor: '#00000000'}} />}
          />
          <TabNavigator.Item
            title="Info"
            onPress={() => {this.setState({addressDetailsViewable: true})}}
            renderIcon={
              () => <NativeIonicon name="information-circle" size={24} style={{backgroundColor: '#00000000'}} />
            }
          />
          {SessionSelectors.get().tokens.access.value && (
            <TabNavigator.Item
              title="Delete"
              renderIcon={() => <NativeIonicon name="trash" size={24} /> }
              onPress={this.deleteAddressPrompt}
            />)}
        </TabNavigator>
      </View>
    );
  }

  closeAddressDetailsModal() {
    this.setState({
      addressDetailsViewable: false,
    });
  }

  renderAddressDetails(address) {
    if(address) {
      return this.renderAddressDetailsIOS(address);
    } else {
      return <View></View>;
    }
  }

  renderAddressDetailsIOS(address) {
    return (
      <View style={{flex: 1}}>
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 10, borderRadius: 2 }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10}}>
            <Text onPress={this.closeAddressDetailsModal}>Close</Text>
            <Text>Edit</Text>
          </View>
          <ScrollView style={{flex: 1}}>
            <Text style={modalContentStyles.title}>Address</Text>
            <Text style={modalContentStyles.bodyText}>{address.street}</Text>
            <Text style={modalContentStyles.title}>Neighborhood</Text>
            <Text style={modalContentStyles.bodyText}>{address.neighborhood}</Text>
            <Text style={modalContentStyles.title}>City</Text>
            <Text style={modalContentStyles.bodyText}>{address.city}</Text>
            <Text style={modalContentStyles.title}>State</Text>
            <Text style={modalContentStyles.bodyText}>{address.state}</Text>
            <Text style={modalContentStyles.title}>Property Type</Text>
            <Text style={modalContentStyles.bodyText}>{Address.PROPERTY_TYPE_DISPLAYS[address.type_of_property - 1]}</Text>
            <Text style={modalContentStyles.title}>Owner Name</Text>
            <Text style={modalContentStyles.bodyText}>{address.owner_name}</Text>
            <Text style={modalContentStyles.title}>Owner Number</Text>
            <Text style={modalContentStyles.bodyText}>{address.owner_contact_number}</Text>
            <Text style={modalContentStyles.title}>Owner Email</Text>
            <Text style={modalContentStyles.bodyText}>{address.owner_email}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }

  render() {
    const { addressId } = this.props.navigation.state.params;
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

    const styles = StyleSheet.create(stylesHash);
    let tags = realm.objects('Tag').filtered('address = $0', addressId);

    if (this.state.deletingAddress) {
      return (
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <ActivityIndicator style={{flex: 1}} />
          <Text style={{margin: 10}}>Deleting Address</Text>
        </View>
      );
    }
    
    if (tags.length == 0) {
      return this.renderNoTagSection();
    }
    
    return this.renderTagsSection(tags);
  }
}
