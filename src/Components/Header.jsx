import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ showProfileIcon = false, showSignIn = false }) => {
  const [showLangList, setShowLangList] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const languages = ["English", "हिन्दी"];

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setShowLangList(false);
  };

  return (
    <div className="absolute z-20 px-8 py-4 bg-gradient-to-b from-black/80 w-full flex justify-between items-center">
      <Link to="/">
        <img
          className="w-28 md:w-36 cursor-pointer"
          src="https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVvRDRqBcLS7fk0Qpns6gQSS3VdMMYtpN_ba4Nzu63yuVrE7JHt-MdKCNAQnJ8SrsPBqivurwF6ugwnAa54jBGNohFD6CNLHDjwQUnPO_cKrHSqgmLOAw0zUe2dRClJd4cchXguY1Bjj.svg"
          alt="NetflixGPT Logo"
        />
      </Link>

      <div className="flex items-center gap-4">
        {showSignIn && (
          <>
            {/* Custom language dropdown */}
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
          <img
            className="w-10 h-10 rounded cursor-pointer"
            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/User_icon_2.svg"
            alt="User Avatar"
          />
        )}
      </div>
    </div>
  );
};

export default Header;