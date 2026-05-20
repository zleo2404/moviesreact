import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ user, onLogout }) {
    return (
        <>
    
            <Navbar user={user} onLogout={onLogout} />
            
            <div className="container">
                <main role="main" className="pb-4" style={{ minHeight: '75vh' }}>
                    <Outlet />
                </main>
            </div>

            <Footer />
        </>
    );
}