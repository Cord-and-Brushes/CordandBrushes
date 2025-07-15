import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "../features/authSlice";
import productReducer from "../features/productSlice";
import blogReducer from "../features/blogSlice";

// Clear any old persisted state that might contain unexpected keys
const clearOldPersistedState = () => {
  try {
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      const parsedState = JSON.parse(persistedState);
      // Check if the state contains unexpected keys
      if (parsedState.banner || parsedState.posts) {
        console.log("Clearing old persisted state with unexpected keys");
        localStorage.removeItem("persist:root");
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking persisted state:", error);
    // If there's an error parsing, clear it anyway
    localStorage.removeItem("persist:root");
    return true;
  }
  return false;
};

// Clear old state on store initialization
clearOldPersistedState();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  blogs: blogReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
