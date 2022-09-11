import {call, put, takeEvery, fork, all} from 'redux-saga/effects';
import {
  addProductSuccess,
  deleteProductSuccess,
  editProductSuccess,
  getProductSuccess,
} from './productSlice';
import firestore from '@react-native-firebase/firestore';

function* workGetProductFetch() {
  const data = yield call(() =>
    firestore().collection('Products').orderBy('createdAt', 'desc').get(),
  );
  yield put(getProductSuccess(data?.docs));
}

function* workAddProduct({payload}) {
  yield call(() =>
    firestore().collection('Products').add({
      name: payload?.name,
      price: payload?.price,
      offeredPrice: payload?.offeredPrice,
      imageUrl: payload.downloadUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
    }),
  );

  yield put(addProductSuccess());
}
function* workEditProduct({payload}) {
  console.log('update payload ==>', payload);

  yield call(() =>
    firestore().collection('Products').doc(payload?.id).update({
      name: payload?.name,
      price: payload?.price,
      offeredPrice: payload?.offeredPrice,
      imageUrl: payload.downloadUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
    }),
  );

  yield put(editProductSuccess());
}

function* workDeleteProduct({payload}) {
  yield call(() => firestore().collection('Products').doc(payload).delete());

  yield put(deleteProductSuccess());
}

function* getProductSaga() {
  yield takeEvery('products/getProductFetch', workGetProductFetch);
}
function* addProductSaga() {
  yield takeEvery('products/addProduct', workAddProduct);
}
function* editProductSaga() {
  yield takeEvery('products/editProduct', workEditProduct);
}
function* deleteProductSaga() {
  yield takeEvery('products/deleteProduct', workDeleteProduct);
}

const productForkSaga = [
  fork(getProductSaga),
  fork(addProductSaga),
  fork(editProductSaga),
  fork(deleteProductSaga),
];

export default function* productSaga() {
  yield all([...productForkSaga]);
}
