import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/userContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="669027925396-mu78a0m8k5k1ullr33boigihj0l9r83h.apps.googleusercontent.com">
        <UserProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/pages/signIn" element={<SignIn />} />
            <Route path="/pages/signUp" element={<SignUp />} />
          </Routes>
        </UserProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
