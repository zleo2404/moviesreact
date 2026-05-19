import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function DeleteScreening({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [screening, setScreening] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. CARICAMENTO DEI DATI DELLA PROIEZIONE
    useEffect(() => {
        const fetchScreening = async () => {
            try {
                // Assicurati che questo endpoint (GET) esista nel tuo C#
                const response = await fetch(`https://localhost:7275/api/Screenings/${id}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setScreening(data);
                } else {
                    setError('Proiezione non trovata o già eliminata.');
                }
            } catch (err) {
                setError('Errore di connessione al server.');
            } finally {
                setLoading(false);
            }
        };

        fetchScreening();
    }, [id]);

    // 2. FUNZIONE PER ELIMINARE DEFINITIVAMENTE
    const handleDelete = async (e) => {
        e.preventDefault(); // Previene il ricaricamento della pagina del tag form
        setIsDeleting(true);
        setError('');

        try {
            // Chiamata DELETE al server C#
            const response = await fetch(`https://localhost:7275/api/Screenings/${id}`, {
                method: 'DELETE',
                credentials: 'include' // Obbligatorio se c'è [Authorize(Roles="Admin")] nel server
            });

            if (response.ok) {
                // Se l'eliminazione ha successo, torna alla lista
                navigate('/screenings');
            } else {
                const data = await response.json().catch(() => ({}));
                setError(data.message || 'Errore durante l\'eliminazione della proiezione.');
                setIsDeleting(false);
            }
        } catch (err) {
            setError('Errore di connessione al server.');
            setIsDeleting(false);
        }
    };

    // Sicurezza: Solo gli Admin possono eliminare
    if (!currentUser || currentUser.role !== 'Admin') {
        return <h3 className="text-center mt-5 text-danger">Accesso Negato. Solo gli Admin possono eliminare.</h3>;
    }

    if (loading) {
        return <h3 className="text-center mt-5">Caricamento dettagli... ⏳</h3>;
    }

    if (error && !screening) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">{error}</div>
                <Link to="/screenings" className="btn btn-dark mt-3">Torna alla Lista</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-danger rounded-lg">
                        
                        <div className="card-header bg-danger text-white text-center py-4">
                            <h2 className="card-title mb-0 fw-bold">🗑️ Delete Screening</h2>
                        </div>
                        
                        <div className="card-body p-5 bg-light">
                            {error && (
                                <div className="alert alert-danger text-center mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="alert alert-warning text-center mb-4 shadow-sm" role="alert">
                                <h4 className="alert-heading fw-bold mb-2">⚠️ Warning!</h4>
                                <p className="mb-0 text-dark">
                                    Are you absolutely sure you want to delete this screening? This action cannot be undone and will remove all associated tickets.
                                </p>
                            </div>
                            
                            <h5 className="text-dark fw-bold mb-4 border-bottom border-danger pb-2">
                                Screening Information
                            </h5>
                            
                            <dl className="row fs-5">
                                <dt className="col-sm-4 text-dark text-md-end">Movie Title</dt>
                                <dd className="col-sm-8 fw-bold text-danger">
                                    {screening.movieTitle}
                                </dd>
                                
                                <dt className="col-sm-4 text-dark text-md-end">Start Time</dt>
                                <dd className="col-sm-8 text-secondary">
                                    🗓️ {new Date(screening.startTime).toLocaleString()}
                                </dd>
                                
                                <dt className="col-sm-4 text-dark text-md-end">Cinema</dt>
                                <dd className="col-sm-8 text-secondary">
                                    🍿 {screening.cinemaName || 'N/A'}
                                </dd>
                            </dl>
                        </div>
                        
                        <div className="card-footer text-center py-4 bg-white border-top-0">
                            <form onSubmit={handleDelete}>
                                <div className="d-flex justify-content-between align-items-center mt-2 px-md-4">
                                    <Link to="/screenings" className="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
                                        🔙 Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        className="btn btn-danger btn-lg px-5 fw-bold shadow-sm"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Eliminazione...' : '🗑️ Yes, Delete'}
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