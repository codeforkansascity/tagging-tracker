import React, { Component } from 'react';
import {
  Image,
  View,
  Button,
  ScrollView,
} from 'react-native';
import { MKTextField } from 'react-native-material-kit';

import styles from './styles';
import CodeEnforcementFlagSwitch from '../CodeEnforcementFlagSwitch/index';

export default class TagDetailsEditDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      codeEnforcementFlags: {
        areWeedsPresent: false,
        isTrashPresent: false,
        isStructureDamaged: false,
      },
    };

    this.onAddressChange = this.onAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onWeedsFlagChange = this.onWeedsFlagChange.bind(this);
    this.onTrashPresentChange = this.onTrashPresentChange.bind(this);
    this.onStructureDamagedChange = this.onStructureDamagedChange.bind(this);
  }

  onAddressChange(address) {
    this.setState({
      address,
    });
  }

  onWeedsFlagChange() {
    this.setState({
      codeEnforcementFlags: {
        ...this.state.codeEnforcementFlags,
        areWeedsPresent: !this.state.codeEnforcementFlags.areWeedsPresent,
      },
    });
  }

  onTrashPresentChange() {
    this.setState({
      codeEnforcementFlags: {
        ...this.state.codeEnforcementFlags,
        isTrashPresent: !this.state.codeEnforcementFlags.isTrashPresent,
      },
    });
  }

  onStructureDamagedChange() {
    this.setState({
      codeEnforcementFlags: {
        ...this.state.codeEnforcementFlags,
        isStructureDamaged: !this.state.codeEnforcementFlags.isStructureDamaged,
      },
    });
  }

  handleSubmit() {
    // TODO: Insert submit handler here
    console.log(this.state.address);
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.pictureContainer}>

            <Image
              source={{
                isStatic: true,
                uri: this.props.navigation.state.params.passProps.data.mediaUri,
              }}
              style={{height: 200, width: 200}}
            />

          </View>
          <MKTextField
            placeholder="Address"
            style={styles.textInput}
            value={this.state.address}
            onTextChange={this.onAddressChange}
          />
          <MKTextField
            placeholder="Square Footage"
            style={styles.textInput}
          />
          <MKTextField
            placeholder="Tag Text"
            style={styles.textInput}
          />
          <View style={styles.codeEnforcementFlagsContainer}>
            <CodeEnforcementFlagSwitch
              value={this.state.codeEnforcementFlags.areWeedsPresent}
              onChange={this.onWeedsFlagChange}
              labelText={'Are weeds present?'}
            />
            <CodeEnforcementFlagSwitch
              value={this.state.codeEnforcementFlags.isTrashPresent}
              onChange={this.onTrashPresentChange}
              labelText={'Is trash present?'}
            />
            <CodeEnforcementFlagSwitch
              value={this.state.codeEnforcementFlags.isStructureDamaged}
              onChange={this.onStructureDamagedChange}
              labelText={'Is structure damaged?'}
            />
          </View>
        </View>

        <View style={styles.workflowButtonsContainer}>
          <View style={styles.workFlowButtonsWrapper}>
            <View style={styles.workflowButton}>
              <Button onPress={this.handleSubmit} title={'Submit'} />
            </View>
            <View style={styles.workflowButton}>
              <Button onPress={() => {}} title={'Cancel'} />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
