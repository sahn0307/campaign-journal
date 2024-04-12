import React, { useEffect, useState } from "react";
// import { Switch, Route } from "react-router-dom";
// import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import routes from '../routes.js'
//import './index.scss'
import AuthProvider from '../context/AuthProvider'
import NavBar from './NavBar';
import Footer from './Footer';

function App() {
  return (
    <div>
      <AuthProvider>
      
        <NavBar />
        <RouterProvider router={routes} />
        <Footer />
      
      </AuthProvider>
    </div>
  );
}

export default App;
