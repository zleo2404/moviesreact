import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://localhost:7275/api/Users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data.user); 
                navigate('/'); 
            } else {
                setError(data.message || 'Email o password non validi.');
            }
        } catch (err) {
            setError('Errore di connessione al server.');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-dark text-white text-center py-4">
                            <h3 className="card-title mb-0 fw-bold">🎟️ Cinema Login</h3>
                        </div>

                        <div className="card-body p-4 bg-light">
                            {error && (
                                <div className="alert alert-danger shadow-sm fw-bold text-center mb-4">
                                    ❌ {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">✉️</span>
                                        <input 
                                            type="email" 
                                            className="form-control border-start-0" 
                                            placeholder="director@hollywood.com" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">🔑</span>
                                        <input 
                                            type="password" 
                                            className="form-control border-start-0" 
                                            placeholder="Enter your secret password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-danger btn-lg fw-bold shadow-sm">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="card-footer text-center py-3 bg-white">
                            <span className="text-muted">Don't have an account yet? </span>
                            <Link to="/register" className="text-danger fw-bold text-decoration-none">Get one here!</Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}