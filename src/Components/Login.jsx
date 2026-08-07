import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { checkValidData } from '../Utils/Validate';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../Utils/Firebase';
import { addUser } from '../Utils/userSlice';
import { DEFAULT_PHOTO_URL } from '../Utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const photoURL = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/browse");
    }
  }, [user, navigate]);

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  const handleButtonClick = () => {
    if (isSubmitting) return;

    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    setIsSubmitting(true);

    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          const finalPhotoURL = photoURL.current.value || DEFAULT_PHOTO_URL;

          updateProfile(user, {
            displayName: name.current.value,
            photoURL: finalPhotoURL,
          })
            .then(() => {
              dispatch(
                addUser({
                  uid: user.uid,
                  email: user.email,
                  displayName: name.current.value,
                  photoURL: finalPhotoURL,
                })
              );
              navigate("/browse");
            })
            .catch((error) => {
              setErrorMessage(error.message);
            })
            .finally(() => setIsSubmitting(false));
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setErrorMessage("This email is already registered. Please sign in instead.");
          } else if (error.code === "auth/weak-password") {
            setErrorMessage("Password is too weak.");
          } else {
            setErrorMessage(error.code + ": " + error.message);
          }
          setIsSubmitting(false);
        });
    } else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          console.log("User signed in:", userCredential.user);
          navigate("/browse");
        })
        .catch((error) => {
          if (error.code === "auth/invalid-credential") {
            setErrorMessage("Incorrect email or password.");
          } else if (error.code === "auth/user-not-found") {
            setErrorMessage("User Not Found.");
          } else if (error.code === "auth/wrong-password") {
            setErrorMessage("Incorrect Password.");
          } else if (error.code === "auth/too-many-requests") {
            setErrorMessage("Too many attempts. Please try again later.");
          } else {
            setErrorMessage(error.code + ": " + error.message);
          }
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-b from-[#2b0000] via-black to-black">
      <Header />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-md mx-auto pt-24 sm:pt-32 md:pt-40 px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 text-white"
      >
        <h1 className="font-bold text-2xl sm:text-3xl mb-6">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <>
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded text-sm sm:text-base"
            />
            <input
              ref={photoURL}
              type="text"
              placeholder="Photo URL (optional)"
              className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded text-sm sm:text-base"
            />
          </>
        )}

        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded text-sm sm:text-base"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-3 my-2 w-full bg-gray-700/60 border border-gray-500 rounded text-sm sm:text-base"
        />

        {errorMessage && (
          <p className="text-red-500 font-medium py-1 text-sm sm:text-base">{errorMessage}</p>
        )}

        <button
          type="submit"
          onClick={handleButtonClick}
          disabled={isSubmitting}
          className="p-3 my-4 w-full bg-red-600 hover:bg-red-700 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? "Please wait..." : isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-gray-400 mt-6 cursor-pointer text-sm sm:text-base" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to Netflix? Sign Up Now"
            : "Already Registered? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;