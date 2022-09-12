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
  TextComponent,
  TouchableOpacity,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Paragraph,
  TextInput,
  Title,
} from 'react-native-paper';

import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductFetch,
} from './redux/productSlice';
import BottomDrawer from './components/BottomDrawer';
import Antdesign from 'react-native-vector-icons/AntDesign';

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

  const {products, isLoading} = useSelector(s => s.products);
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
    setUploading(true);
    let downloadUrl = imageUrl;
    if (!!imageFile) {
      const {uri} = imageFile;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      const task = storage().ref(filename).putFile(uploadUri);
      try {
        await task;
        downloadUrl = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        return console.error(e);
      }
    }

    dispatch(
      editProduct({
        id,
        name,
        price,
        offeredPrice,
        downloadUrl,
      }),
    );
    dispatch(getProductFetch());

    setUploading(false);
    setModalVisible(false);
    setIsEditing(false);
    setName('');
    setPrice('');
    setOfferedPrice('');
    setImageFile(null);
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
    <View style={styles.item}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Avatar.Image
          size={130}
          source={{
            uri: item._data.imageUrl,
          }}
        />
        <View style={{marginLeft: 20}}>
          <Title style={{fontSize: 20, fontWeight: 'bold'}}>
            {item._data.name}
          </Title>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Title
              style={{
                marginRight: 6,
                color: 'gray',
                fontSize: 16,
                textDecorationLine: 'line-through',
              }}>
              {item._data.price}$
            </Title>

            <Title style={{fontSize: 16, fontWeight: 'bold'}}>
              {item._data.offeredPrice}$
            </Title>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleDelete(item.id)}>
              <Antdesign name="delete" color="red" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleEdit(item)}>
              <Antdesign name="edit" color="blue" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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

      <Button
        mode="contained"
        color="#3ded97"
        style={{
          alignSelf: 'flex-end',
          marginRight: 20,
          marginVertical: 8,
        }}
        disabled={!isLoading}
        onPress={() => setModalVisible(true)}>
        Add New
      </Button>
      {!isLoading ? (
        <ActivityIndicator
          size={'large'}
          color="#000000"
          style={{
            marginVertical: 300,
          }}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fda172',
  },

  item: {
    backgroundColor: '#3ded97',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 20,
  },
  buttonContainer: {
    backgroundColor: '#ffffff',
    padding: 5,
    borderRadius: 20,
    marginRight: 10,
  },

  title: {
    fontSize: 32,
    color: '#000000',
  },
});

export default App;
