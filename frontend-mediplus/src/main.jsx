// main.jsx (tout en haut)
window.global ||= window;
window.process ||= {
  env: {},
  nextTick: (fn, ...args) => setTimeout(() => fn(...args), 0),
  browser: true,
};

// Fonction pour nettoyer le localStorage corrompu
const cleanLocalStorage = () => {
  const keysToCheck = ["token", "cachedUser", "theme", "locale"];

  keysToCheck.forEach((key) => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        // Essayer de parser si c'est censé être du JSON
        if (key === "cachedUser") {
          JSON.parse(value);
        }
      }
    } catch (error) {
      console.warn(
        `Suppression de la clé localStorage corrompue: ${key}`,
        error
      );
      localStorage.removeItem(key);
    }
  });

  // Nettoyage supplémentaire pour les clés inconnues qui pourraient contenir du JSON invalide
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        const value = localStorage.getItem(key);
        if (
          value &&
          (value.includes('"MediPlus') ||
            value.startsWith('"MediPlus') ||
            value.includes("MediPlusAc"))
        ) {
          console.warn(`Suppression de clé suspecte: ${key}`);
          localStorage.removeItem(key);
          i--; // Ajuster l'index après suppression
        }
      } catch (error) {
        console.warn(`Suppression de clé corrompue: ${key}`, error);
        localStorage.removeItem(key);
        i--; // Ajuster l'index après suppression
      }
    }
  }

  // Nettoyage forcé de toutes les clés qui commencent par des guillemets et contiennent MediPlus
  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    try {
      const value = localStorage.getItem(key);
      if (
        value &&
        (value.startsWith('"MediPlus') || value.includes("MediPlusAc"))
      ) {
        console.warn(`Nettoyage forcé de clé suspecte: ${key}`);
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Erreur lors du nettoyage de ${key}:`, error);
      localStorage.removeItem(key);
    }
  });
};

// Nettoyer le localStorage au démarrage
cleanLocalStorage();

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
