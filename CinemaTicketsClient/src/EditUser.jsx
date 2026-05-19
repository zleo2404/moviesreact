import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditUser({ currentUser, setCurrentUser}) {
    const { id } = useParams(); // Prende l'ID dall'URL (es. /users/edit/5)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        rowVersion: '' // Qui salveremo la "firma" per la concorrenza
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isConflict, setIsConflict] = useState(false); // Gestisce la comparsa del tasto Refresh

    // 1. CARICAMENTO DATI INIZIALI DAL SERVER
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
                    setError('Impossibile caricare i dati dell\'utente.');
                }
            } catch (err) {
                setError('Errore di connessione al server.');
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. SALVATAGGIO DELLE MODIFICHE
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
                credentials: 'include' // Fondamentale per far capire al server chi siamo
            });

            const data = await response.json();

            if (response.ok) {
                if (currentUser && currentUser.id === parseInt(id)) {
                // Update the global state with the new form data
                setCurrentUser({ ...currentUser, ...formData });
    }
                const newRowVersion = data.rowVersion || data.RowVersion; 
    if (newRowVersion) {
        // Aggiorna il form con la nuova firma del database per il prossimo click!
        setFormData(prev => ({ ...prev, rowVersion: newRowVersion }));
    }
                setSuccessMessage("✅ " + data.message);
            } else if (response.status === 409) {
                // ERRORE DI CONCORRENZA: Un altro utente ha modificato i dati nel frattempo
                setError("❌ " + data.message);
                setIsConflict(true);
            } else {
                setError("❌ " + (data.message || 'Errore durante il salvataggio.'));
            }
        } catch (err) {
            setError('❌ Errore di connessione al server.');
        }
    };

    // Funzione per ricaricare i dati in caso di conflitto (ricarica la pagina)
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="container mt-5 mb-5">
            {successMessage && (
                <div className="alert alert-success shadow-sm fw-bold text-center mb-4">
                    {successMessage}
                </div>
            )}
            
            {error && (
                <div className="alert alert-danger shadow-sm fw-bold text-center mb-4">
                    {error}
                </div>
            )}

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-dark text-white text-center py-4 border-bottom border-danger border-3">
                            <h2 className="card-title mb-0 fw-bold">⚙️ Edit User Profile</h2>
                        </div>
                        
                        <div className="card-body p-5 bg-light">
                            
                            {/* Tasto Refresh che compare solo in caso di conflitto di RowVersion */}
                            {isConflict && (
                                <div className="text-center mb-4">
                                    <button onClick={handleRefresh} type="button" className="btn btn-danger fw-bold">
                                        🔄 Refresh Page
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold text-dark">First Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">👤</span>
                                            <input 
                                                type="text"
                                                name="firstName" 
                                                value={formData.firstName} 
                                                onChange={handleChange} 
                                                className="form-control border-start-0" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold text-dark">Last Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">👤</span>
                                            <input 
                                                type="text"
                                                name="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleChange} 
                                                className="form-control border-start-0" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">✉️</span>
                                        <input 
                                            type="email"
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            className="form-control border-start-0" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Phone Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">📞</span>
                                        <input 
                                            type="tel"
                                            name="phoneNumber" 
                                            value={formData.phoneNumber || ''} 
                                            onChange={handleChange} 
                                            className="form-control border-start-0" 
                                        />
                                    </div>
                                </div>

                                {/* Nel tuo codice originale era type="text", lo lascio così ma puoi metterlo a "password" */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">🔑</span>
                                        <input 
                                            type="text"
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            className="form-control border-start-0" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Controllo Ruolo: visibile e modificabile SOLO se l'utente loggato è un Admin */}
                                {currentUser && currentUser.role === 'Admin' && (
                                    <div className="mb-3">
                                        <label className="form-label fw-bold text-dark">Role</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">🛡️</span>
                                            <input 
                                                type="text"
                                                name="role" 
                                                value={formData.role} 
                                                onChange={handleChange} 
                                                className="form-control border-start-0" 
                                                required 
                                            />
                                        </div>
                                    </div>
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