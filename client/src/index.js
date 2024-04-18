import React from "react";
import App from "./components/App2";
import "./index.css";
import { createRoot } from "react-dom/client";
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AuthProvider>
    <App />
    <ToastContainer />
  </AuthProvider>
);