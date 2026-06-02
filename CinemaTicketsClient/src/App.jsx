import { Routes, Route } from 'react-router-dom';

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
import ConfirmBooking from './ConfirmBook';

export default function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
        
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route path="users" element={<UsersList />} />
        <Route path="users/edit/:id" element={<EditUser />} />
        <Route path="users/delete/:id" element={<DeleteUser />} />

        <Route path="screenings" element={<Screenings />} />
        <Route path="screenings/create" element={<CreateScreening />} />
        <Route path="screenings/delete/:id" element={<DeleteScreening />} />
        <Route path="screenings/details/:id" element={<DetailsScreening />} />

        <Route path="reservations/book/:id" element={<ConfirmBooking />} />
        
      </Route>
    </Routes>
  );
}