import React from 'react';
import { createRoot, Routes } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import styles from './stylesheets/styles.scss';

const root = createRoot(document.getElementById('root'));
root.render(
  //   <BrowserRouter>
  <div>
    <App />
  </div>
  //   </BrowserRouter>
);

/* from the webpack
plugins: ['@babel/plugin-transform-runtime', '@babel/transform-async-to-generator'],
*/
