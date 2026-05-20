import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function CreateScreening() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [formData, setFormData] = useState({
        movieTitle: '',
        startTime: '',
        cinemaId: ''
    });

    const [cinemas, setCinemas] = useState([]);
    const [error, setError] = useState('');

    //retrieve list of cinemas for the select
    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await fetch('https://localhost:7275/api/Cinemas', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setCinemas(data);
                }
            } catch (err) {
                console.error("Error uploading cinemas", err);
            }
        };

        fetchCinemas();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://localhost:7275/api/Screenings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    movieTitle: formData.movieTitle,
                    startTime: formData.startTime,
                    cinemaId: parseInt(formData.cinemaId)
                }),
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/screenings');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Errore creating a screening.');
            }
        } catch (err) {
            setError('Error connecting with the server.');
        }
    };

    //Only admin can see the page
    if (!currentUser || currentUser.role !== 'Admin') {
        return <h3 className="text-center mt-5 text-danger">Only admin can visit this page.</h3>;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-dark text-white text-center py-4 border-bottom border-danger border-3">
                            <h2 className="card-title mb-0 fw-bold">🍿 Create New Screening</h2>
                        </div>
                        
                        <div className="card-body p-5 bg-light">
                            {error && (
                                <div className="alert alert-danger shadow-sm fw-bold text-center mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                
                                <div className="mb-4">
                                    <label className="form-label fw-bold text-dark">Movie Title</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">🎬</span>
                                        <input 
                                            type="text" 
                                            name="movieTitle"
                                            value={formData.movieTitle}
                                            onChange={handleChange}
                                            className="form-control border-start-0" 
                                            placeholder="e.g. The Matrix" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-dark">Start Time</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">🗓️</span>
                                        <input 
                                            type="datetime-local" 
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            className="form-control border-start-0" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-dark">Cinema Theater</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">🍿</span>
                                        <select 
                                            name="cinemaId" 
                                            value={formData.cinemaId}
                                            onChange={handleChange}
                                            className="form-select border-start-0" 
                                            required
                                        >
                                            <option value="">-- Seleziona un Cinema --</option>
                                            {cinemas.map(cinema => (
                                                <option key={cinema.id} value={cinema.id}>
                                                    {cinema.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <hr className="my-4 text-muted" />

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <Link to="/screenings" className="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
                                        🔙 Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-danger btn-lg px-5 fw-bold shadow-sm">
                                        ➕ Create
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