import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

export default function App() {
  //checks local storage if we have a logged user, so i can keep the session
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cinema_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  //update local storage when the user login/logout
  useEffect(() => {
    if (user) {
      localStorage.setItem('cinema_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cinema_user');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
        await fetch('https://localhost:7275/api/Users/logout', { 
            method: 'POST', 
            credentials: 'include' 
        });
        setUser(null);
        navigate('/');
    } catch (err) {
        console.error("Logout error", err);
    }
  };

  return (
    <Routes>
      {/*Layout over everything*/}
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        
        <Route index element={<Home currentUser={user}/>} /> {/* La Home ("/") */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="login" element={<Login onLogin={setUser} />} />
        <Route path="register" element={<Register />} />
        
        <Route path="users" element={<UsersList currentUser={user} />} />

        <Route path="users/edit/:id" element={<EditUser currentUser={user} setCurrentUser={setUser} />} />
        <Route path="users/delete/:id" element={<DeleteUser currentUser={user} />} />


        <Route path="screenings" element={<Screenings currentUser={user} />} />

        <Route path="screenings/create" element={<CreateScreening currentUser={user} />} />
        <Route path="screenings/delete/:id" element={<DeleteScreening currentUser={user} />} />
        <Route path="screenings/details/:id" element={<DetailsScreening currentUser={user} />} />
        
      </Route>
    </Routes>
  );
}