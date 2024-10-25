import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

// Configuração inicial do i18next
i18next.init({
  interpolation: { escapeValue: false },
  lng: 'pt',
  resources: {
    pt: {
      translation: {}
    },
    en: {
      translation: {}
    },
    de: {
      translation: {}
    },
    fr: {
      translation: {}
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </I18nextProvider>
  </React.StrictMode>
);