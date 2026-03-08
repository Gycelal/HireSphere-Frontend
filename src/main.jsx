import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import appStore from './store/store.js'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {GoogleOAuthProvider } from "@react-oauth/google"


createRoot(document.getElementById('root')).render(
  
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={appStore}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    </StrictMode>
  
)
