import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
  [
    { label: "Audio Description", slug: "audio-description" },
    { label: "Investor Relations", slug: "investor-relations" },
    { label: "Legal Notices", slug: "legal-notices" },
  ],
  [
    { label: "Help Centre", slug: "help-center" },
    { label: "Jobs", slug: "jobs" },
    { label: "Cookie Preferences", slug: "cookie-preferences" },
  ],
  [
    { label: "Gift Cards", slug: "gift-cards" },
    { label: "Terms of Use", slug: "terms-of-use" },
    { label: "Corporate Information", slug: "corporate-information" },
  ],
  [
    { label: "Media Centre", slug: "media-center" },
    { label: "Privacy", slug: "privacy" },
    { label: "Contact Us", slug: "contact-us" },
  ],
];

const LANGUAGES = ["English", "हिन्दी"];

// Decorative only — no real social presence for this demo project
const SOCIAL_ICONS = [
  {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z",
  },
  {
    label: "Instagram",
    path: "M12 2c2.7 0 3.1 0 4.1.1 1 .1 1.7.2 2.3.5.6.2 1.1.6 1.6 1.1.5.5.8.9 1.1 1.6.2.6.4 1.3.5 2.3.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c-.1 1-.2 1.7-.5 2.3-.2.6-.6 1.1-1.1 1.6-.5.5-.9.8-1.6 1.1-.6.2-1.3.4-2.3.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1-.1-1.7-.2-2.3-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-.9-1.1-1.6-.2-.6-.4-1.3-.5-2.3C2 15.1 2 14.7 2 12s0-3.1.1-4.1c.1-1 .2-1.7.5-2.3.2-.6.6-1.1 1.1-1.6.5-.5.9-.8 1.6-1.1.6-.2 1.3-.4 2.3-.5C8.9 2 9.3 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.4 6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
  },
  {
    label: "Twitter",
    path: "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.6.8-2.5 1a4 4 0 0 0-6.9 3.6A11.3 11.3 0 0 1 3.9 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.3-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.6.1-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.4a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.4-1.3 2-2.1z",
  },
  {
    label: "YouTube",
    path: "M23 12s0-3.6-.5-5.3a3 3 0 0 0-2.1-2.1C18.7 4 12 4 12 4s-6.7 0-8.4.5A3 3 0 0 0 1.5 6.7C1 8.4 1 12 1 12s0 3.6.5 5.3a3 3 0 0 0 2.1 2.1C5.3 20 12 20 12 20s6.7 0 8.4-.5a3 3 0 0 0 2.1-2.1C23 15.6 23 12 23 12zM9.7 15.5V8.5L15.8 12l-6.1 3.5z",
  },
];

const Footer = () => {
  const [showLangList, setShowLangList] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <footer className="bg-black border-t border-white/10 px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Social icons */}
        <div className="flex items-center gap-4 mb-6">
          {SOCIAL_ICONS.map((icon) => (
            <span
              key={icon.label}
              title={icon.label}
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition cursor-default"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d={icon.path} />
              </svg>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mb-8">
          {FOOTER_COLUMNS.map((column, i) => (
            <ul key={i} className="flex flex-col gap-3">
              {column.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/info/${item.slug}`}
                    className="text-gray-500 hover:text-gray-300 hover:underline text-sm transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="relative inline-block mb-6">
          <button
            onClick={() => setShowLangList(!showLangList)}
            className="flex items-center gap-2 border border-gray-600 text-gray-400 text-sm px-3 py-1.5 rounded hover:text-gray-200 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
            </svg>
            {selectedLang}
            <span className="text-xs">▼</span>
          </button>

          {showLangList && (
            <ul className="absolute bottom-full mb-1 w-full bg-black border border-gray-700 rounded overflow-hidden text-sm z-10">
              {LANGUAGES.map((lang) => (
                <li
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setShowLangList(false);
                  }}
                  className="px-3 py-2 text-gray-300 hover:bg-gray-800 cursor-pointer"
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-gray-600 text-xs leading-relaxed">
          NetflixGPT is an independent, non-commercial portfolio project and is not affiliated with,
          endorsed by, or connected to Netflix, Inc. Movie and TV data provided by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-400"
          >
            TMDB
          </a>
          .
        </p>
        <p className="text-gray-700 text-xs mt-2">© 2026 NetflixGPT</p>
      </div>
    </footer>
  );
};

export default Footer;