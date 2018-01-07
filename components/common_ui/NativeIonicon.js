import React, { Component } from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const getFullIconName = (name) => {
  let prefix = '';

  if(Platform.OS == 'ios') {
    prefix = 'ios';
  } else if(Platform.OS == 'android') {
    prefix = 'md';
  }

  return `${prefix}-${name}`;
};

const NativeIonicon = ({name, ...customProps}) => <Icon name={getFullIconName(name)} {...customProps} />;
export default NativeIonicon;
