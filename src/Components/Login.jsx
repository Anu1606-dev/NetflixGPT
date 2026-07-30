import { useState } from 'react';
import Header from './Header';

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div className="relative h-screen w-screen bg-gradient-to-b from-[#2b0000] via-black to-black">
      <Header />

      <form className="w-full max-w-md mx-auto pt-32 sm:pt-40 p-8 sm:p-10 text-white">
        <h1 className="font-bold text-3xl mb-2">
          {isSignInForm ? "Enter your info to sign in" : "Sign Up"}
        </h1>
        {isSignInForm && (
          <p className="text-gray-400 mb-6">Or get started with a new account.</p>
        )}

        {!isSignInForm && (
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded"
          />
        )}

        <input
          type="text"
          placeholder="Email or mobile number"
          className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded"
        />

        <button
          type="submit"
          className="p-3 my-4 w-full bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          {isSignInForm ? "Continue" : "Sign Up"}
        </button>

        <p className="text-gray-400 mt-6 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm ? "New to Netflix? Sign up now." : "Already registered? Sign in now."}
        </p>

        <p className="text-xs text-gray-500 mt-8">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
      </form>
    </div>
  );
};

export default Login;