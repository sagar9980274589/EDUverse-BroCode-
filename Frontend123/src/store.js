import { configureStore, combineReducers } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice.js";
import PostSlice from "./PostSlice.js";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// Persist config
const persistConfig = {
  key: "root", // Root key for persist
  storage, // Using localStorage as the default storage
  blacklist: ["socket"], // Blacklist socket slice to prevent it from persisting
};

// Combine reducers
const rootReducer = combineReducers({
  chat: chatSlice, // Chat state
  data: UserSlice, // User data
  posts: PostSlice, // Post-related state
  socket: socketSlice, // Socket instance state
});

// Apply persistReducer to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "socket/setSocket", // Ignore socket-related actions
        ],
        ignoredPaths: ["socket.socket"], // Ignore the socket field in the state
      },
    }),
});

// Create persistor
export const persistor = persistStore(store); // Allows persistence for other slices
