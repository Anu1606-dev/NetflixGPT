import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
import { removeUser } from '../Utils/userSlice';
import { LOGO_URL, DEFAULT_PHOTO_URL, LANGUAGES, NAV_LINKS } from '../Utils/constants';
import AvatarPicker from './AvatarPicker';

const Header = ({ showProfileIcon = false, showSignIn = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const [showLangList, setShowLangList] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false); // NEW

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
    <div className="absolute z-20 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-b from-black/90 to-transparent w-full flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link to="/">
          <img
            className="w-24 md:w-32 cursor-pointer"
            src={LOGO_URL}
            alt="NetflixGPT Logo"
          />
        </Link>

        {showProfileIcon && (
          <ul className="hidden lg:flex items-center gap-5 text-sm text-gray-200">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link}
                className={`cursor-pointer hover:text-white ${i === 0 ? "text-white font-semibold" : ""}`}
              >
                {link}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showSignIn && (
          <>
            <div className="relative">
              <button
                onClick={() => setShowLangList(!showLangList)}
                className="flex items-center gap-1 bg-black/60 text-white border border-gray-500 rounded px-3 py-1 text-sm"
              >
                {selectedLang}
                <span className="text-xs">▼</span>
              </button>

              {showLangList && (
                <ul className="absolute mt-1 w-full bg-black border border-gray-600 rounded overflow-hidden text-sm">
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
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded font-medium">
                Sign In
              </button>
            </Link>
          </>
        )}

        {showProfileIcon && (
          <div className="flex items-center gap-4 text-white">
            <span className="cursor-pointer text-lg">🔍</span>

            <div className="relative cursor-pointer">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                12
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1"
              >
                <div className="w-8 h-8 rounded-md overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover block"
                    src={avatarUrl}
                    alt="User Avatar"
                  />
                </div>
                <span className="text-xs">▼</span>
              </button>

              {showProfileMenu && (
                <ul className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-700 rounded overflow-hidden text-sm">
                  {user?.displayName && (
                    <li className="px-3 py-2 text-gray-400 border-b border-gray-700 cursor-default">
                      Signed in as <span className="text-white font-medium">{user.displayName}</span>
                    </li>
                  )}
                  <li
                    onClick={() => {
                      setShowAvatarPicker(true);   // NEW
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
              )}
            </div>
          </div>
        )}
      </div>

      {showAvatarPicker && (
        <AvatarPicker onClose={() => setShowAvatarPicker(false)} />
      )}
    </div>
  );
};

export default Header;