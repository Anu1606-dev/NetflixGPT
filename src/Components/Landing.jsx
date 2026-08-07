import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import { LANDING_BG_URL } from '../Utils/constants';

const Landing = () => {
  const navigate = useNavigate();
  const email = useRef(null);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      navigate("/browse");
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          className="h-full w-full object-cover"
          src={LANDING_BG_URL}
          alt="Netflix background"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <Header showSignIn={true} />

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white min-h-screen px-4 py-24">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold max-w-3xl mb-3 md:mb-4 leading-tight">
          Unlimited movies, shows, and more
        </h1>
        <p className="text-base sm:text-lg md:text-2xl mb-3 md:mb-4">
          Starts at ₹149. Cancel at any time.
        </p>
        <p className="mb-4 text-sm sm:text-base md:text-lg max-w-xl">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xl">
          <input
            ref={email}
            type="email"
            placeholder="Email address"
            className="flex-1 p-3 md:p-4 rounded bg-black/40 border border-gray-400 text-white placeholder-gray-300 text-sm md:text-base"
          />
          <button
            onClick={handleGetStarted}
            className="bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-3 md:py-4 rounded font-semibold whitespace-nowrap flex items-center justify-center gap-1"
          >
            Get Started <span className="text-xl md:text-2xl">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;