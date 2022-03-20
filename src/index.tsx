import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from '@app/App';
import SignIn from '@pages/sign-in.page';
import SignOut from '@pages/sign-out.page';
import { persistor, store } from '@store/index';
import * as serviceWorker from '@app/serviceWorker';

import '@app/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <Router>
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-out" element={<SignOut />} />
              <Route path="/*" element={<App />} />
            </Routes>
          </Router>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
