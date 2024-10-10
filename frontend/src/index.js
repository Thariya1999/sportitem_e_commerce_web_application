import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {Provider} from 'react-redux'
import store from './store';

// react alert showing in user UI
import { positions, transitions, Provider as AlertProvider } from 'react-alert';
// import alert template
import AlertTemplate from 'react-alert-template-basic'

const options = {
  timeout: 5000, // message showing time
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App/>
    </AlertProvider>
  </Provider>
);


