import React, { Component } from 'react';
import { ImageBackground, Dimensions, View, Text } from 'react-native';

const win = Dimensions.get('window');

module.exports = ({imgSrc, title}) => {
  return (
    <ImageBackground
      style={{width: win.width, height: 400, position: 'relative'}}
      source={{uri: imgSrc}} 
    >
      {title && <View style={{width: win.width, position: 'absolute', bottom: 0, padding: 20, backgroundColor: '#000000BB'}}>
        <Text style={{color: '#ffffff', fontSize: 34}}>{title}</Text>
      </View>}
    </ImageBackground>
  );
};
