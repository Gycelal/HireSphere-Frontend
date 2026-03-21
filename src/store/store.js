import { combineReducers, configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import themeReducer from "./slices/themeSlice"
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer
})
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "theme"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const appStore = configureStore({
    reducer: persistedReducer,
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export const persistor = persistStore(appStore)
export default appStore

