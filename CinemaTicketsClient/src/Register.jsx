import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from './components/FormInput';
import FeedbackMessage from './components/FeedbackMessage';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'User'
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
            const response = await fetch('https://localhost:7275/api/Users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setTimeout(() => navigate('/login'), 2500);
            } else {
                setError((data.message || 'Error during registration.'));
            }
        } catch (err) {
            setError('Server connection error.');
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

                            <FeedbackMessage message={error} type="error" />
                            <FeedbackMessage message={successMessage} type="success" />

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput
                                            label="First Name" icon="👤" name="firstName"
                                            placeholder="John" value={formData.firstName} onChange={handleChange} required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <FormInput
                                            label="Last Name" icon="👤" name="lastName"
                                            placeholder="Doe" value={formData.lastName} onChange={handleChange} required
                                        />
                                    </div>
                                </div>

                                <FormInput
                                    label="Email Address" icon="✉️" type="email" name="email"
                                    placeholder="john.doe@hollywood.com" value={formData.email} onChange={handleChange}
                                    title="Inserisci un indirizzo email valido (es: nome@dominio.com)" required
                                />

                                <FormInput
                                    label="Phone Number" icon="📞" type="tel" name="phoneNumber"
                                    placeholder="+1 555 1234567" value={formData.phoneNumber} onChange={handleChange} pattern="^\+?[0-9\s\-]{7,15}$"
                                    title="Inserisci un numero di telefono valido (min 7, max 15 caratteri)" required
                                />

                                <FormInput
                                    label="Password" icon="🔑" type="password" name="password"
                                    placeholder="Create a password" value={formData.password} onChange={handleChange} required
                                />

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