import React, { Component } from 'react';
import { Platform, Text } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons';
import Icon from 'react-native-vector-icons/Ionicons';

const renderContainer = (optionNodes) => {
  return <View>{optionNodes}</View>;
}

const NativeSegmentedControls = (props) => {
  if (Platform.OS == 'android') {
    return (<SegmentedControls
      selectedTint={'#000000'}
      separatorWidth={0}
      containerStyle={{
        borderColor: 'rgba(0, 0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 0,
      }}

      optionStyle={
        {
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }
      }

      optionContainerStyle={
        {
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }
      }
      {...props}
    />);
  } else {
    return (
      <SegmentedControls 
        selectedTint= {'white'}
        {...props} 
      />
    )
  }
}

NativeSegmentedControls.renderOption = (option, selected, onSelect, index) => {
  const style = {
    textAlign: 'center',
  }
  style.fontWeight = selected ? 'bold' : 'normal';

  if (Platform.OS == 'android') {
    style.borderColor = 'rgb(0, 0, 0)';
    style.borderBottomWidth = selected ? 1 : 0;
    style.paddingBottom = 5;
    style.paddingTop = 5;
  } else {
    style.color = selected ? '#fff' : '#000';
  }
  
  return <Text style={style} onPress={onSelect} key={index}>{option}</Text>;
}

export default NativeSegmentedControls;
