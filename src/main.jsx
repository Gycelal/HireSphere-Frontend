import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store,{persistor} from './features/store.js'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
)

