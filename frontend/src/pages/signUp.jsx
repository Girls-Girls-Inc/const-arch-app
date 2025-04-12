'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Email signup error:', error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google User:', result.user);
      navigate('/');
    } catch (error) {
      console.error('Google Sign-up error:', error.message);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook User:', result.user);
      navigate('/');
    } catch (error) {
      console.error('Facebook Sign-up error:', error.message);
    }
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Sign Up</button>
      </form>

      <hr />

      <button onClick={handleGoogleSignUp}>Sign Up with Google</button><br />
      <button onClick={handleFacebookSignUp}>Sign Up with Facebook</button>
    </main>
  );
}