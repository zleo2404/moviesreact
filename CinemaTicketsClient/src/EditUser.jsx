import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormInput from './components/FormInput';
import FeedbackMessage from './components/FeedbackMessage';

export default function EditUser({ currentUser, setCurrentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        rowVersion: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isConflict, setIsConflict] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`https://localhost:7275/api/Users/${id}`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    setError('Unable to load user data.');
                }
            } catch (err) {
                setError('Server connection error.');
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsConflict(false);

        try {
            const response = await fetch(`https://localhost:7275/api/Users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                if (currentUser && currentUser.id === parseInt(id)) {
                    setCurrentUser({ ...currentUser, ...formData });
                }
                const newRowVersion = data.rowVersion || data.RowVersion;
                if (newRowVersion) {
                    // updates the form with the new database signature for the next click
                    setFormData(prev => ({ ...prev, rowVersion: newRowVersion }));
                }
                setSuccessMessage("✅ " + data.message);
            } else if (response.status === 409) {
                //Another user has modified the data in the meantime
                setError("❌ " + data.message);
                setIsConflict(true);
            } else {
                setError("❌ " + (data.message || 'Error during save.'));
            }
        } catch (err) {
            setError('❌ Server connection error.');
        }
    };

    // Function to reload data in case of conflict (reloads the page)
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="container mt-5 mb-5">

            <FeedbackMessage message={successMessage} type="success" />

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-lg">

                        <div className="card-header bg-dark text-white text-center py-4 border-bottom border-danger border-3">
                            <h2 className="card-title mb-0 fw-bold">⚙️ Edit User Profile</h2>
                        </div>

                        <div className="card-body p-5 bg-light">

                            {/* Refresh button that appears only in case of RowVersion conflict */}
                            <FeedbackMessage message={error} type="error">
                                {isConflict && (
                                    <button onClick={handleRefresh} type="button" className="btn btn-danger fw-bold mt-2">
                                        🔄 Refresh Page
                                    </button>
                                )}
                            </FeedbackMessage>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput
                                            label="First Name" icon="👤" name="firstName"
                                            value={formData.firstName} onChange={handleChange} required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <FormInput
                                            label="Last Name" icon="👤" name="lastName"
                                            value={formData.lastName} onChange={handleChange} required
                                        />
                                    </div>
                                </div>

                                <FormInput
                                    label="Email Address" icon="✉️" type="email" name="email"
                                    value={formData.email} onChange={handleChange} required
                                />

                                <FormInput
                                    label="Phone Number" icon="📞" type="tel" name="phoneNumber"
                                    value={formData.phoneNumber || ''} onChange={handleChange}
                                />

                                <FormInput
                                    label="Password" icon="🔑" type="text" name="password"
                                    value={formData.password} onChange={handleChange} required
                                />

                                {currentUser && currentUser.role === 'Admin' && (
                                    <FormInput
                                        label="Role" icon="🛡️" name="role"
                                        value={formData.role} onChange={handleChange} required
                                    />
                                )}

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <button type="button" onClick={() => navigate(-1)} className="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
                                        🔙 Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger btn-lg px-5 fw-bold shadow-sm">
                                        💾 Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}