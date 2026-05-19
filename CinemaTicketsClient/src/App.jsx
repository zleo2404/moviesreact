import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Importiamo il Layout e tutte le pagine che abbiamo creato
import Layout from './Layout';
import Login from './Login';
import Register from './Register';
import UsersList from './UsersList';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import Home from './Home';
import Privacy from './Privacy';
import Screenings from './Screenings';
import CreateScreening from './CreateScreening'; 
import DeleteScreening from './DeleteScreening';
import DetailsScreening from './ScreeningDetails';

const ScreeningsPlaceholder = () => <h1 className="text-center mt-5">Programmazione Film in arrivo... 🎬</h1>;
const UserDetailsPlaceholder = () => <h1 className="text-center mt-5">Dettagli Utente... 🔍</h1>;

export default function App() {
  // Gestione dello stato dell'utente (null = ospite)
  // 1. INSTEAD OF useState(null), WE CHECK LOCAL STORAGE FIRST
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // When the page refreshes, React looks here first
    const savedUser = localStorage.getItem('cinema_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. AUTOMATICALLY SAVE TO LOCAL STORAGE WHENEVER USER LOGS IN
  useEffect(() => {
    if (user) {
      localStorage.setItem('cinema_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cinema_user');
    }
  }, [user]);

  // 3. UPDATE LOGOUT TO CLEAR EVERYTHING
  const handleLogout = async () => {
    try {
        await fetch('https://localhost:7275/api/Users/logout', { 
            method: 'POST', 
            credentials: 'include' 
        });
        setUser(null); // This will trigger the useEffect above to clear localStorage
        navigate('/');
    } catch (err) {
        console.error("Logout error", err);
    }
  };

  return (
    <Routes>
      {/* ROTTA PADRE: Il Layout avvolge tutto */}
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        
        {/* ROTTE PUBBLICHE (Visibili a tutti) */}
        <Route index element={<Home currentUser={user}/>} /> {/* La Home ("/") */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="screenings" element={<Screenings currentUser={user} />} />
        
        {/* Passiamo setUser al Login così può aggiornare lo stato quando entriamo */}
        <Route path="login" element={<Login onLogin={setUser} />} />
        <Route path="register" element={<Register />} />
        
        {/* ROTTE PROTETTE (Passiamo currentUser={user} per far scattare i controlli) */}
        {/* Lista di tutti gli utenti (Solo Admin) */}
        <Route path="users" element={<UsersList currentUser={user} />} />

        <Route path="screenings/create" element={<CreateScreening currentUser={user} />} />
        <Route path="screenings/delete/:id" element={<DeleteScreening currentUser={user} />} />
        <Route path="screenings/details/:id" element={<DetailsScreening currentUser={user} />} />
        
        {/* Operazioni sul singolo utente (Nota il parametro dinamico :id) */}
        <Route path="users/edit/:id" element={<EditUser currentUser={user} setCurrentUser={setUser} />} />
        <Route path="users/delete/:id" element={<DeleteUser currentUser={user} />} />
        <Route path="users/details/:id" element={<UserDetailsPlaceholder />} />

      </Route>
    </Routes>
  );
}