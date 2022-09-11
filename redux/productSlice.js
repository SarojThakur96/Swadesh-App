import {createSlice} from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    isLoading: false,
  },
  reducers: {
    getProductFetch: state => {
      state.isLoading = false;
    },
    getProductSuccess: (state, action) => {
      state.products = action.payload;
      state.isLoading = true;
    },
    addProduct: data => {
      return data;
    },
    addProductSuccess: state => {
      state.isLoading = true;
    },
    editProduct: data => {
      return data;
    },
    editProductSuccess: state => {
      state.isLoading = true;
    },
    deleteProduct: id => {
      return id;
    },
    deleteProductSuccess: state => {
      state.isLoading = true;
    },
  },
});

export const {
  getProductFetch,
  getProductSuccess,
  addProduct,
  addProductSuccess,
  editProduct,
  editProductSuccess,
  deleteProduct,
  deleteProductSuccess,
} = productSlice.actions;

export default productSlice.reducer;
