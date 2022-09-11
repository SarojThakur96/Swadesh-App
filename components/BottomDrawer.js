import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Avatar, Button, TextInput} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';

const BottomDrawer = ({
  ModalVisible,
  setModalVisible,
  uploading,
  name,
  setName,
  price,
  setPrice,
  offeredPrice,
  setOfferedPrice,
  imageFile,
  imageUrl,
  setImageFile,
  handleAddItem,
  handleEditItem,
  isEditing,
  setIsEditing,
}) => {
  const launchGallary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
      });
      setImageFile(result?.assets[0]);
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <Modal
      style={styles.modal}
      // onBackButtonPress={() => setModalVisible(false)}
      // onBackdropPress={() => setModalVisible(false)}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={ModalVisible}>
      <View style={styles.modalItem}>
        <TextInput
          label="Name"
          mode="outlined"
          activeUnderlineColor="#000000"
          activeOutlineColor="#000000"
          value={name}
          onChangeText={text => setName(text)}
        />

        <TextInput
          label="Price($)"
          mode="outlined"
          keyboardType="numeric"
          activeUnderlineColor="#000000"
          activeOutlineColor="#000000"
          value={price}
          onChangeText={text => setPrice(text)}
          style={{
            marginVertical: 10,
          }}
        />
        <TextInput
          label="Offered Price($)"
          mode="outlined"
          keyboardType="numeric"
          activeUnderlineColor="#000000"
          activeOutlineColor="#000000"
          value={offeredPrice}
          onChangeText={text => setOfferedPrice(text)}
          style={{
            marginVertical: 10,
          }}
        />
        <View style={styles.imageContainer}>
          <Avatar.Image
            size={100}
            source={{
              uri: imageFile?.uri || imageUrl,
            }}
          />
          <Button
            mode="contained"
            color="blue"
            style={{marginLeft: 10, borderRadius: 20}}
            onPress={launchGallary}>
            Pick Image
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            color="red"
            style={{
              width: '40%',
              borderColor: 'red',
            }}
            onPress={() => {
              setModalVisible(false);
              setIsEditing(false);
              setName('');
              setPrice('');
              setOfferedPrice('');
            }}>
            Cancel
          </Button>
          <Button
            mode="contained"
            color="#000"
            loading={uploading}
            style={{
              width: '40%',
            }}
            onPress={!isEditing ? handleAddItem : handleEditItem}>
            {!!isEditing ? 'Update' : 'Add'}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default BottomDrawer;

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    margin: 0,
  },
  modalItem: {
    flex: 0.55,
    backgroundColor: '#f3ead3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
