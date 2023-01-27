import React from 'react';
import ReactDOM from 'react-dom/client';
import { FirebaseAppProvider } from 'reactfire';
import { Provider } from 'react-redux';

import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

import { store } from './store';
import App from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyBf5HZOVcUEv3Njn1ns1owsxUm_qESHMYQ',
  authDomain: 'youchoose-9c077977.firebaseapp.com',
  projectId: 'youchoose-9c077977',
  storageBucket: 'youchoose-9c077977.appspot.com',
  messagingSenderId: '617654727751',
  appId: '1:617654727751:web:c9b2e802a61a1b82b42d62',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <App />
      </FirebaseAppProvider>
    </Provider>
  </React.StrictMode>,
);
