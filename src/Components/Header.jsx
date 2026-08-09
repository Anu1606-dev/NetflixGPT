import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
import { removeUser } from '../Utils/userSlice';
import { toggleGptSearchView } from '../Utils/gptSlice';
import { LOGO_URL, DEFAULT_PHOTO_URL, LANGUAGES, NAV_LINKS } from '../Utils/constants';
import AvatarPicker from './AvatarPicker';

const Header = ({ showProfileIcon = false, showSignIn = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  const [showLangList, setShowLangList] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setShowLangList(false);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error.code, error.message);
      });
  };

  const avatarUrl = user?.photoURL || DEFAULT_PHOTO_URL;

  return (
    <div className="absolute z-20 px-4 sm:px-6 md:px-8 py-3 md:py-4 w-full flex justify-between items-center bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-transparent">
      <div className="flex items-center gap-4 md:gap-8">
        <Link to="/">
          <img
            className="w-20 sm:w-24 md:w-32 cursor-pointer"
            src={LOGO_URL}
            alt="NetflixGPT Logo"
          />
        </Link>

        {showProfileIcon && !showGptSearch && (
          <ul className="hidden lg:flex items-center gap-2 text-sm text-gray-200">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={
                    location.pathname === link.path
                      ? "bg-white text-black rounded-full px-4 py-1.5 font-semibold block"
                      : "px-4 py-1.5 hover:text-white block"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {showProfileIcon && !showGptSearch && (
          <button
            className="lg:hidden text-white"
            onClick={() => setShowMobileNav(!showMobileNav)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showMobileNav ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        {showSignIn && (
          <>
            <div className="relative">
              <button
                onClick={() => setShowLangList(!showLangList)}
                className="flex items-center gap-1 bg-black/60 text-white border border-gray-500 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm"
              >
                {selectedLang}
                <span className="text-xs">▼</span>
              </button>

              {showLangList && (
                <ul className="absolute mt-1 w-full bg-black border border-gray-600 rounded overflow-hidden text-sm z-30">
                  {LANGUAGES.map((lang) => (
                    <li
                      key={lang}
                      onClick={() => handleLangSelect(lang)}
                      className="px-3 py-2 text-white hover:bg-gray-700 cursor-pointer"
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link to="/login">
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1 rounded font-medium text-sm sm:text-base">
                Sign In
              </button>
            </Link>
          </>
        )}

        {showProfileIcon && (
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-white">
            <button
              onClick={() => dispatch(toggleGptSearchView())}
              className="hidden sm:flex items-center gap-1.5 bg-white text-black text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-200 transition"
            >
              {showGptSearch ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Browse
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                    <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
                    <path d="M5 13l.5 1.5L7 15l-1.5.5L5 17l-.5-1.5L3 15l1.5-.5L5 13z" />
                  </svg>
                  Search by GPT
                </>
              )}
            </button>

            {!showGptSearch && (
              <>
                <button className="hover:opacity-80 transition" aria-label="Search">
                  <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                <div className="relative cursor-pointer hover:opacity-80 transition">
                  <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    12
                  </span>
                </div>
              </>
            )}

            <div ref={profileRef} className="relative group py-2 -my-2">
              <button
                className="flex items-center gap-1"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover block"
                    src={avatarUrl}
                    alt="User Avatar"
                  />
                </div>
                <svg
                  className={`w-3 h-3 transition-transform ${showProfileMenu ? "rotate-180" : ""} group-hover:rotate-180`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-40 sm:w-48 h-2"></div>

              <ul
                className={`absolute right-0 top-full mt-2 w-40 sm:w-48 bg-black/95 border border-gray-700 rounded overflow-hidden text-sm transition-opacity duration-150 ${
                  showProfileMenu ? "opacity-100 visible" : "opacity-0 invisible"
                } group-hover:opacity-100 group-hover:visible`}
              >
                {user?.displayName && (
                  <li className="px-3 py-2 text-gray-400 border-b border-gray-700 cursor-default truncate">
                    Signed in as <span className="text-white font-medium">{user.displayName}</span>
                  </li>
                )}
                <li
                  onClick={() => {
                    setShowAvatarPicker(true);
                    setShowProfileMenu(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                >
                  Change Avatar
                </li>
                <li className="px-3 py-2 hover:bg-gray-700 cursor-pointer">Account</li>
                <li onClick={handleSignOut} className="px-3 py-2 hover:bg-gray-700 cursor-pointer">
                  Sign out
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {showMobileNav && showProfileIcon && !showGptSearch && (
        <ul className="lg:hidden absolute top-full left-0 w-full bg-black/95 border-t border-gray-800 flex flex-col text-white text-sm z-30">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={() => setShowMobileNav(false)}
                className={`block px-6 py-3 border-b border-gray-800 ${
                  location.pathname === link.path ? "font-semibold text-white" : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showAvatarPicker && (
        <AvatarPicker onClose={() => setShowAvatarPicker(false)} />
      )}
    </div>
  );
};

export default Header;