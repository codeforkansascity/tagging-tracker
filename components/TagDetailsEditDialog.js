import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
} from 'react-native';
import { MKTextField, MKButton } from 'react-native-material-kit';
import Geocoder from 'react-native-geocoding';
Geocoder.setApiKey('AIzaSyD4Oan5v5glCpoKUNUN_AjckZ29YeETzV4');

const RaisedButton = MKButton.flatButton().build();
const AccentColoredRaisedButton = MKButton.accentColoredButton().build();

export default class TagDetailsEditDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      neighborhood: '',
      coordinate: {
        latitude: 0,
        longitude: 0,
      },
    }

    this.onAddressChange = this.onAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.getCurrentLatLong = this.getCurrentLatLong.bind(this);
  }

  componentDidMount() {

    // this.getCurrentLatLong().then(coordinate => {
    //   alert(coordinate);
    //   // this.setState({
    //   //   coordinate: {
    //   //     latitude: coordinate.latitude,
    //   //     longitude: coordinate.longitude,
    //   //   }
    //   // })
    // });

    this.getAddressFromLatLong(this.state.coordinate).then(address => {
      this.setState({
        address: address.formatted_address,
        neighborhood: address.neighborhood,
      })
    });
  }

  getCurrentLatLong() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      const coordinate = pos.coords;
      Promise.resolve(coordinate);
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      Promise.reject('error');
    };

    return navigator.geolocation.getCurrentPosition(success, error, options);
  }

  getAddressFromLatLong(coords) {
    return new Promise((resolve, reject) => {
      Geocoder.getFromLatLng(coords.latitude, coords.longitude).then(
        json => {
          const formatted_address = json.results[0].formatted_address;

          let address_component = json.results[0].address_components.find((component) => {
            return component.types.includes('neighborhood');
          });
          const neighborhood = address_component.long_name;

          const address = {
            formatted_address: formatted_address,
            neighborhood: neighborhood,
          };

          resolve(address);
        },
        error => {
          resolve('');
        }
      );
    })
  }

  onAddressChange(address) {
    this.setState({
      address: address.formatted_address,
    });
  }

  onNeighborhoodChange(address) {
    this.setState({
      neighborhood: address.neighborhood,
    });
  }

  handleSubmit() {
    // TODO: Insert submit handler here
    console.log(this.state.address);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pictureContainer}>
          <Text>Picture Container</Text>
        </View>
          <MKTextField
          placeholder="Neighborhood"
          style={styles.textInput}
          value={this.state.neighborhood}
          onTextChange={this.onNeighborhoodChange}
        />
        <MKTextField
          placeholder="Address"
          style={styles.textInput}
          value={this.state.address}
          onTextChange={this.onAddressChange}
        />
        <View style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
          <View style={styles.workFlowContainer}>
            <View style={styles.workflowButton}>
              <Button onPress={this.handleSubmit} title={'Submit'} />
            </View>
            <View style={styles.workflowButton}>
              <Button onPress={() => { console.log('cancel') }} title={'Cancel'} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pictureContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'solid',
    padding: 20,
    margin: 10,
  },
  textInput: {
    width: '80%',
    marginBottom: 20,
  },
  workFlowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  workflowButton: {
    marginRight: 10,
  },
});
