import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ showProfileIcon = false, showSignIn = false }) => {
  const [showLangList, setShowLangList] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const languages = ["English", "हिन्दी"];

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setShowLangList(false);
  };

  const navLinks = ["Home", "Shows", "Movies", "Games", "New & Popular", "My List", "Browse by Languages"];

  return (
    <div className="absolute z-20 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-b from-black/90 to-transparent w-full flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link to="/">
          <img
            className="w-24 md:w-32 cursor-pointer"
            src="https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVvRDRqBcLS7fk0Qpns6gQSS3VdMMYtpN_ba4Nzu63yuVrE7JHt-MdKCNAQnJ8SrsPBqivurwF6ugwnAa54jBGNohFD6CNLHDjwQUnPO_cKrHSqgmLOAw0zUe2dRClJd4cchXguY1Bjj.svg"
            alt="NetflixGPT Logo"
          />
        </Link>

        {showProfileIcon && (
          <ul className="hidden lg:flex items-center gap-5 text-sm text-gray-200">
            {navLinks.map((link, i) => (
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
                  {languages.map((lang) => (
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
                <img
                  className="w-8 h-8 rounded"
                  src="https://occ-0-2232-2186.1.nflxso.net/dnm/api/v6/SO2HoVCx33X8phZh2pZZmQ4QgNY/AAAABRSzRacW3r_cmBGpsUArW055MeDHm-e-5QQ2S2dJhAKGb1wxxJzhDtHqe7WXCr-0_JqehuLMy0nphR19_S1J5AA4TQe4O3A.png?r=d8a"
                  alt="User Avatar"
                />
                <span className="text-xs">▼</span>
              </button>

              {showProfileMenu && (
                <ul className="absolute right-0 mt-2 w-40 bg-black/95 border border-gray-700 rounded overflow-hidden text-sm">
                  <li className="px-3 py-2 hover:bg-gray-700 cursor-pointer">Manage Profiles</li>
                  <li className="px-3 py-2 hover:bg-gray-700 cursor-pointer">Account</li>
                  <li className="px-3 py-2 hover:bg-gray-700 cursor-pointer">Sign out of Netflix</li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;