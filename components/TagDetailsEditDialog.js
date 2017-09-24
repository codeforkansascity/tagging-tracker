import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
} from 'react-native';
import { MKTextField, MKButton } from 'react-native-material-kit';

const RaisedButton = MKButton.flatButton().build();
const AccentColoredRaisedButton = MKButton.accentColoredButton().build();

export default class TagDetailsEditDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
    };

    this.onAddressChange = this.onAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onAddressChange(address) {
    this.setState({
      address,
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
