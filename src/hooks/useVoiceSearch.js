import { useState, useRef, useEffect, useCallback } from 'react';

const getSpeechRecognitionAPI = () =>
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// Wraps the browser's native Web Speech API.
// Exposes a live `transcript` (updates as you speak) and a `finalTranscript`
// (only set once, when the browser is confident it heard the full sentence).
const useVoiceSearch = () => {
  const SpeechRecognitionAPI = getSpeechRecognitionAPI();
  const isSupported = !!SpeechRecognitionAPI;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      if (final) {
        setTranscript(final);
        setFinalTranscript(final);
      } else {
        setTranscript(interim);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError("Didn't catch that — try again.");
      } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError("Microphone access was denied.");
      } else if (event.error !== 'aborted') {
        setError("Voice search isn't working right now.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setError(null);
    setTranscript('');
    setFinalTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // ignore "recognition already started" errors from rapid double-clicks
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const clearFinalTranscript = useCallback(() => setFinalTranscript(''), []);

  return {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    clearFinalTranscript,
  };
};

export default useVoiceSearch;