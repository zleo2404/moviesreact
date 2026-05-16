import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ user, onLogout }) {
    return (
        <>
            {/* 1. Il menu in alto (gli passiamo i dati dell'utente) */}
            <Navbar user={user} onLogout={onLogout} />
            
            {/* 2. Il corpo centrale dinamico */}
            <div className="container">
                <main role="main" className="pb-4" style={{ minHeight: '75vh' }}>
                    <Outlet />
                </main>
            </div>

            {/* 3. Il pié di pagina */}
            <Footer />
        </>
    );
}