import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// project-import
import renderRoutes, { routes } from './routes';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==============================|| APP ||============================== //

const App = () => {
  return <BrowserRouter >{renderRoutes(routes)}
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </BrowserRouter>;
};

export default App;
