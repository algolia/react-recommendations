import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from './routes/HomePage';
import { ProductPage } from './routes/ProductPage';
import { Root } from './routes/Root';

import '@algolia/autocomplete-theme-classic';
import '@algolia/ui-components-horizontal-slider-theme';
import './App.css';
import './Recommend.css';

// needed for github pages subdirectory
const basename = process.env.SUB_PATH || '/';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/product/:id',
          element: <ProductPage />,
        },
      ],
    },
  ],
  {
    basename,
  }
);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
);
