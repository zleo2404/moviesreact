import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Il motore per cambiare pagina
import App from './App.jsx';

// Importiamo il CSS globale e Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Il Regista prende il div "root" e ci inietta dentro l'App intera
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter avvolge l'App e le permette di avere URL come /login o /screenings */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);