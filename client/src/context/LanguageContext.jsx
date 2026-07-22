"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const LanguageContext = createContext(null);

const STORAGE_KEY = "language";
const DEFAULT_LANGUAGE = "en";

const listeners = new Set();

function subscribe(onChange) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
}

// The server has no localStorage, so it always renders the default.
function getServerSnapshot() {
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const changeLanguage = useCallback((lang) => {
    localStorage.setItem(STORAGE_KEY, lang);
    listeners.forEach((notify) => notify());
  }, []);

  const value = useMemo(
    () => ({ language, changeLanguage }),
    [language, changeLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
