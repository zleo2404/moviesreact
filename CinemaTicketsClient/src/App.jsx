import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login';
// Immaginiamo di avere queste altre pagine:
// import Home from './Home';
// import Screenings from './Screenings';

export default function App() {
  // Teniamo in memoria l'utente loggato. Se è null, l'utente è un ospite.
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    // Qui andrà la chiamata fetch POST a /api/Users/logout
    setUser(null);
  };

  return (
    // Definiamo quali componenti caricare in base all'URL
    <Routes>
      {/* La "Rotta Padre": Applica il Layout a TUTTE le pagine al suo interno */}
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        
        {/* Quando l'URL è esattamente "/", mostra la Home */}
        {/* <Route index element={<Home />} /> */}

        {/* Quando l'URL è "/login", mostra il componente Login */}
        <Route path="login" element={<Login />} />
        
        {/* <Route path="screenings" element={<Screenings />} /> */}
      </Route>
    </Routes>
  );
}