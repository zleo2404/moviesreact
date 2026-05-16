import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('https://localhost:7123/api/Users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("✅ " + data.message);
                setTimeout(() => navigate('/login'), 2500);
            } else {
                setError("❌ " + (data.message || 'Errore durante la registrazione.'));
            }
        } catch (err) {
            setError('❌ Errore di connessione al server.');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-dark text-white text-center py-4">
                            <h3 className="card-title mb-0 fw-bold">🎫 Join us!</h3>
                        </div>
                        
                        <div className="card-body p-4 bg-light">
                            {error && <div className="alert alert-danger shadow-sm fw-bold text-center mb-4">{error}</div>}
                            {successMessage && <div className="alert alert-success shadow-sm fw-bold text-center mb-4">{successMessage}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold text-secondary">First Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">👤</span>
                                            <input 
                                                type="text" 
                                                className="form-control border-start-0" 
                                                name="firstName"
                                                placeholder="John" 
                                                value={formData.firstName} 
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold text-secondary">Last Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">👤</span>
                                            <input 
                                                type="text" 
                                                className="form-control border-start-0" 
                                                name="lastName"
                                                placeholder="Doe" 
                                                value={formData.lastName} 
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">✉️</span>
                                        <input 
                                            type="email" 
                                            className="form-control border-start-0" 
                                            name="email"
                                            placeholder="john.doe@hollywood.com" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary">Phone Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">📞</span>
                                        <input 
                                            type="tel" 
                                            className="form-control border-start-0" 
                                            name="phoneNumber"
                                            placeholder="+1 555 1234567" 
                                            value={formData.phoneNumber} 
                                            onChange={handleChange} 
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
                                            name="password"
                                            placeholder="Create a password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-danger btn-lg fw-bold shadow-sm">
                                        🍿 Register
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="card-footer text-center py-3 bg-white">
                            <span className="text-muted">Already have an account? </span>
                            <Link to="/login" className="text-danger fw-bold text-decoration-none">Log in here!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}