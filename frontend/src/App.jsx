import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to GG inc</h1>
      <div className="flex gap-6">
        <Link
          to = "/pages/signIn"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
        <Link
          to ="/pages/signUp"
          className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-100 transition"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}

export default App
