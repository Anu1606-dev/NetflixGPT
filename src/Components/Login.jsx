import { useRef, useState } from 'react';
import Header from './Header';
import { checkValidData } from '../Utils/Validate';

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Refs for uncontrolled inputs
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null); // clear old errors when switching forms
  };

  const handleButtonClick = () => {
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    const message = checkValidData(emailValue, passwordValue);
    setErrorMessage(message);

    if (message) return; // stop here if validation failed

    // Validation passed — this is where Firebase Sign In/Sign Up logic goes next
    if (isSignInForm) {
      // signInWithEmailAndPassword(...) will go here
    } else {
      // createUserWithEmailAndPassword(...) will go here
      // name.current.value is available here for the Sign Up flow
    }
  };

  return (
    <div className="relative h-screen w-screen bg-gradient-to-b from-[#2b0000] via-black to-black">
      <Header />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-md mx-auto pt-32 sm:pt-40 p-8 sm:p-10 text-white"
      >
        <h1 className="font-bold text-3xl mb-6">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded"
          />
        )}

        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded"
        />

        {/* Error message shows only when there is one */}
        {errorMessage && (
          <p className="text-red-500 font-medium py-1">{errorMessage}</p>
        )}

        <button
          type="submit"
          onClick={handleButtonClick}
          className="p-3 my-4 w-full bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-gray-400 mt-6 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to Netflix? Sign Up Now"
            : "Already Registered? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;