import React from 'react';
import { View, Switch, Text } from 'react-native';

import styles from './styles';

const CodeEnforcementFlagSwitch = ({ value, onChange, labelText }) => {
  return (
    <View style={styles.codeEnforcementFlag}>
      <Switch
        value={value}
        onValueChange={onChange}
      />
      <Text style={styles.codeEnforcementFlagLabel}>{labelText}</Text>
    </View>
  );
};

export default CodeEnforcementFlagSwitch;

