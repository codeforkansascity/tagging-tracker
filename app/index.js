import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { MKTextField, MKButton } from 'react-native-material-kit';

const RaisedButton = MKButton.flatButton().build();
const AccentColoredRaisedButton = MKButton.accentColoredButton().build();

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pictureContainer}>
          <Text>Picture Container</Text>
        </View>
        <MKTextField placeholder="Address" style={styles.textInput} />
        <View style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
          <View style={styles.workFlowContainer}>
            <View style={styles.workflowButton}>
              <AccentColoredRaisedButton>
                <Text pointerEvents="none" style={{ color: 'white', fontWeight: 'bold', }}>
                  Submit
                </Text>
              </AccentColoredRaisedButton>
            </View>
            <View style={styles.workflowButton}>
              <RaisedButton>
                <Text pointerEvents="none" style={{ fontWeight: 'bold', }}>
                  Cancel
                </Text>
              </RaisedButton>
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
