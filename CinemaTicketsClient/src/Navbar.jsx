import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom box-shadow mb-4 py-2">
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img src="/img/logo.jpg" alt="CinemaTickets Logo" height="50" className="me-2" />
                        <span className="fw-bold tracking-wide">CinemaTickets</span>
                    </Link>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div id="navbarMenu" className="navbar-collapse collapse d-md-inline-flex justify-content-between align-items-center">
                        <ul className="navbar-nav flex-grow-1 mb-2 mb-md-0">
                            <li className="nav-item"><Link className="nav-link text-dark" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link text-dark" to="/privacy">Privacy</Link></li>
                            <li className="nav-item"><Link className="nav-link text-dark" to="/screenings">Screenings</Link></li>
                            {user && user.role === 'Admin' && (
                                <li className="nav-item"><Link className="nav-link text-dark" to="/users">Users</Link></li>
                            )}
                        </ul>

                        <ul className="navbar-nav ms-auto align-items-center gap-2">
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <span className="navbar-text text-dark fw-bold me-2">Welcome, {user.firstName}!</span>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-sm btn-outline-dark fw-bold" to={`/users/edit/${user.id}`}>Edit Info</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={onLogout} className="btn btn-sm btn-danger fw-bold">Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/login">Login</Link></li>
                                    <li className="nav-item"><Link className="btn btn-danger fw-bold px-3" to="/register">Sign up</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}