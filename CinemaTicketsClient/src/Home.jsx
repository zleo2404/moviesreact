import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Home() {
    
    const { user: currentUser } = useAuth();

    return (
        <div className="d-flex align-items-center justify-content-center w-100" style={{ minHeight: '75vh' }}>
            <div className="row align-items-center w-100">
                
                <div className="col-md-6 text-center text-md-start mb-5 mb-md-0">
                    <h1 className="display-3 fw-bold text-danger mb-3">
                        🎬 Welcome to CinemaTickets!
                    </h1>
                    
                    {currentUser ? (
                        <>
                            <h3 className="mb-4 text-dark">
                                Hello, <span className="text-danger fw-bold">{currentUser.firstName}</span>!
                                <br /> We're glad to see you again.
                            </h3>

                            <div className="mt-4">
                                {currentUser.role === "Admin" ? (
                                    <div className="card shadow-lg border-dark mx-auto mx-md-0" style={{ maxWidth: '400px' }}>
                                        <div className="card-header bg-dark text-white">
                                            <h5 className="card-title mb-0">⚙️ Admin Area</h5>
                                        </div>
                                        <div className="card-body bg-light">
                                            <p className="card-text text-dark">Manage theaters, add new movies, and control screenings.</p>
                                            <Link to="/screenings" className="btn btn-outline-danger fw-bold">
                                                Manage Screenings
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card shadow-lg border-danger mx-auto mx-md-0" style={{ maxWidth: '400px' }}>
                                        <div className="card-header bg-danger text-white">
                                            <h5 className="card-title mb-0">🍿 Our Movies</h5>
                                        </div>
                                        <div className="card-body bg-light">
                                            <p className="card-text text-dark">Discover currently showing movies and book your seat right away!</p>
                                            <Link to="/screenings" className="btn btn-danger fw-bold shadow-sm">
                                                View Screenings
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        
                        <>
                            <p className="lead mb-4 text-dark fw-bold">
                                Discover currently showing movies and book your seat conveniently online.
                            </p>
                            
                            <div className="d-flex d-md-inline-flex justify-content-center justify-content-md-start gap-3">
                                <Link to="/login" className="btn btn-danger btn-lg px-4 shadow-sm fw-bold">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn btn-dark btn-lg px-4 shadow-sm fw-bold">
                                    Register now
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="col-md-6 text-center">
                    <img 
                        src="/img/home.jpg" 
                        alt="Cinema Interior" 
                        className="img-fluid shadow-lg border border-5 border-white rounded-4 w-100" 
                    />
                </div>
                
            </div>
        </div>
    );
}