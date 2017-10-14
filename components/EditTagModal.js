import React from 'react';

import {
  Text,
  View,
  Modal,
} from 'react-native';

const EditTagModal = ({ visible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        alert("Modal has been closed.")
      }}
    >
      <View style={{ marginTop: 22 }}>
        <View>
          <Text>Hello World!</Text>

          <TouchableHighlight onPress={() => {
            this.setModalVisible(!this.state.modalVisible)
          }}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>

        </View>
      </View>
    </Modal>
  );
};

export default EditTagModal;
