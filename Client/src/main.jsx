import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import App from "./App";
import { store, persistor } from "./redux/store/store";
import { BrowserRouter as Router } from "react-router-dom";
import { checkAndClearStorage } from "./utils/clearStorage";
import { initializeAuth } from "./redux/features/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Check and clear old persisted state before rendering
checkAndClearStorage();

// Initialize auth state from localStorage
store.dispatch(initializeAuth());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
