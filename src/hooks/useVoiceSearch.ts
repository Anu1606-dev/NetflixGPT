import { useState, useRef, useEffect, useCallback } from 'react';

const getSpeechRecognitionAPI = (): any =>
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

interface UseVoiceSearchReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  finalTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  clearFinalTranscript: () => void;
}

const useVoiceSearch = (): UseVoiceSearchReturn => {
  const SpeechRecognitionAPI = getSpeechRecognitionAPI();
  const isSupported = !!SpeechRecognitionAPI;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
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

    recognition.onerror = (event: any) => {
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
  }, [isSupported, SpeechRecognitionAPI]);

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