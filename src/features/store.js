import {configureStore} from "@reduxjs/toolkit"
import {persistReducer, persistStore} from 'redux-persist'
import { combineReducers } from "@reduxjs/toolkit"
import storage from 'redux-persist/lib/storage'
import authReducer from './auth/authSlice'
import themeReducer from './theme/themeSlice'

const persistConfig={
    key:'root',
    storage,
    whitelist:['auth']
}


const rootReducer = combineReducers({
    auth:authReducer,
    theme:themeReducer,
})


const persistedReducer = persistReducer(persistConfig,rootReducer)


const store = configureStore({
    reducer:persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck:false
        })

    })


export const persistor  = persistStore(store)
export default store
