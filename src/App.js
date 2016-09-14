import React, { Component } from 'react';
import { Provider } from 'react-redux';
import './App.css';

import configureStore from './store/configureStore';
import AppContainer from './containers/App';

const store = configureStore();

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default Root;
