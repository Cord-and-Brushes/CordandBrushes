import { useState } from "react";
import "./App.css";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import Login from "./components/Login";
import { Route, Routes, useLocation } from "react-router-dom";



function App() {
  const location = useLocation();
 return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className="bg-primary text-tertiary">
        {location.pathname!== '/' && <Navbar />}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
          <ToastContainer />
        </main>
      </PersistGate>
    </Provider>
 );
}

export default App;
