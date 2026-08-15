import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
import { addUser } from '../Utils/userSlice';
import { AVATARS } from '../Utils/constants';
import useEscapeKey from '../hooks/useEscapeKey';

const AvatarPicker = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [customUrl, setCustomUrl] = useState(useEscapeKey(onClose));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveAvatar = (newPhotoURL) => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setError(null);

    updateProfile(auth.currentUser, { photoURL: newPhotoURL })
      .then(() => {
        dispatch(addUser({ ...user, photoURL: newPhotoURL }));
        onClose();
      })
      .catch(() => {
        setError("Couldn't update avatar. Please try again.");
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-[#141414] border border-gray-700 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md text-white mx-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Choose your avatar</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {AVATARS.map((url) => (
            <button
              key={url}
              onClick={() => saveAvatar(url)}
              disabled={isSaving}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden ring-2 ring-transparent hover:ring-white transition disabled:opacity-50"
            >
              <img src={url} alt="avatar option" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400 mb-2">Or paste your own image URL:</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-sm"
          />
          <button
            onClick={() => customUrl && saveAvatar(customUrl)}
            disabled={isSaving || !customUrl}
            className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            Use
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button onClick={onClose} className="text-gray-400 hover:text-white text-sm mt-2">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AvatarPicker;