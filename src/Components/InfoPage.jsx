import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { FOOTER_CONTENT } from '../Utils/footerContent';

const InfoPage = () => {
  const { slug } = useParams();
  const content = FOOTER_CONTENT[slug];

  return (
    <div className="relative bg-black min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 md:px-12 max-w-3xl mx-auto w-full">
        {content ? (
          <>
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6">
              {content.title}
            </h1>
            <div className="flex flex-col gap-4">
              {content.body.map((paragraph, i) => (
                <p key={i} className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mt-16">
            <h1 className="text-white text-xl sm:text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              This page doesn't exist.
            </p>
          </div>
        )}

        <Link
          to="/"
          className="inline-block mt-8 text-gray-400 hover:text-white text-sm underline"
        >
          ← Back to Home
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default InfoPage;