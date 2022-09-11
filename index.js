/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {configureStore} from '@reduxjs/toolkit';
import productSaga from './redux/productSaga';
import productReducer from './redux/productSlice';

const saga = createSagaMiddleware();
const store = configureStore({
  reducer: {
    products: productReducer,
  },
  middleware: [saga],
});

saga.run(productSaga);

const wrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => wrappedApp);
