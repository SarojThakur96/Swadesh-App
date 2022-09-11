/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Card, Paragraph, TextInput, Title} from 'react-native-paper';

import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductFetch,
} from './redux/productSlice';
import BottomDrawer from './components/BottomDrawer';

const App = () => {
  const [ModalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [imageFile, setImageFile] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState('');

  const products = useSelector(s => s.products.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductFetch());
  }, [dispatch]);

  const handleAddItem = async () => {
    setIsEditing(false);
    if (!imageFile) {
      return Alert.alert('Please Select Image');
    }
    const {uri} = imageFile;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    const task = storage().ref(filename).putFile(uploadUri);

    try {
      await task;
      const downloadUrl = await storage().ref(filename).getDownloadURL();
      console.log(downloadUrl);
      dispatch(
        addProduct({
          name,
          price,
          offeredPrice,
          downloadUrl,
        }),
      );
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    setModalVisible(false);
    setImageFile(null);
    dispatch(getProductFetch());
  };

  const handleEditItem = async () => {
    if (!imageFile) {
      return Alert.alert('Please Select Image');
    }
    const {uri} = imageFile;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    const task = storage().ref(filename).putFile(uploadUri);

    try {
      await task;
      const downloadUrl = await storage().ref(filename).getDownloadURL();
      console.log(downloadUrl);
      dispatch(
        editProduct({
          id,
          name,
          price,
          offeredPrice,
          downloadUrl,
        }),
      );
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    setModalVisible(false);
    setIsEditing(false);
    setName('');
    setPrice('');
    setOfferedPrice('');
    setImageFile(null);
    dispatch(getProductFetch());
  };

  const handleDelete = docId => {
    Alert.alert('Are You Sure You Want to Delete?', '', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          dispatch(deleteProduct(docId));
          dispatch(getProductFetch());
        },
      },
    ]);
  };
  const handleEdit = doc => {
    setIsEditing(true);
    setModalVisible(true);
    setId(doc?.id);
    setName(doc?._data?.name);
    setPrice(doc?._data?.price);
    setOfferedPrice(doc?._data?.offeredPrice);
    setImageUrl(doc?._data?.imageUrl);
  };

  const renderItem = ({item}) => (
    <Card style={styles.item}>
      <Card.Content>
        <Title>{item._data.name}</Title>
      </Card.Content>
      <Card.Cover source={{uri: item._data.imageUrl}} />
      <Card.Content style={{flexDirection: 'row'}}>
        <Title
          style={{
            marginRight: 10,
            color: 'gray',
            textDecorationLine: 'line-through',
          }}>
          {item._data.price}
        </Title>

        <Title>{item._data.offeredPrice}</Title>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleDelete(item.id)}>Delete</Button>
        <Button onPress={() => handleEdit(item)}>Edit</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BottomDrawer
        ModalVisible={ModalVisible}
        setModalVisible={setModalVisible}
        uploading={uploading}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        offeredPrice={offeredPrice}
        setOfferedPrice={setOfferedPrice}
        imageFile={imageFile}
        imageUrl={imageUrl}
        setImageFile={setImageFile}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <Button onPress={() => setModalVisible(true)}>Add New</Button>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ead3',
  },

  item: {
    backgroundColor: '#fcfbfc',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },

  title: {
    fontSize: 32,
    color: '#000000',
  },
});

export default App;
