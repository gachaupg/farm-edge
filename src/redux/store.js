import AuthReducer from "./features/authSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import cartReducer from "./features/cartSlice";
// import messageReducer from "./features/Message";
// import helpReducer from "./features/HelpSlice";
import answerReducer from "./features/answerSlice";
const rootReducer = combineReducers({
  auth: AuthReducer,

  deposits:answerReducer,
});
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export const persistor = persistStore(store);
