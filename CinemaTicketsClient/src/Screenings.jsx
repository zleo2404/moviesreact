import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Screenings({ currentUser }) {
    // Stati per salvare le proiezioni, i caricamenti e gli errori
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Traduzione esatta del tuo @if(canEdit) di C#
    const canEdit = currentUser && currentUser.role === 'Admin';

    // Recupera la lista delle proiezioni dal server quando la pagina si apre
    useEffect(() => {
        const fetchScreenings = async () => {
            try {
                // Assicurati che l'URL corrisponda al tuo controller C# (presumibilmente api/Screenings)
                const response = await fetch('https://localhost:7275/api/Screenings');
                
                if (response.ok) {
                    const data = await response.json();
                    setScreenings(data);
                } else {
                    setError('Impossibile caricare la programmazione.');
                }
            } catch (err) {
                setError('Errore di connessione al server.');
            } finally {
                setLoading(false);
            }
        };

        fetchScreenings();
    }, []);

    if (loading) {
        return <h3 className="text-center mt-5">Caricamento film in corso... ⏳</h3>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <div className="container mb-4 mt-4">
            <div className="mb-4 mt-4">
                <h1 className="text-danger fw-bold m-0">🎬 Film Screenings</h1>
            </div>
               
            {/* Tasto Create: Visibile solo se canEdit è vero */}
            {canEdit && (
                <Link to="/screenings/create" className="btn btn-danger fw-bold shadow-sm px-4 mb-3">
                    🍿 Create New
                </Link>
            )}

            {/* Controllo se ci sono film (in C# usavi !Model.Any()) */}
            {screenings.length === 0 ? (
                <div className="alert alert-light border border-danger shadow-sm text-center py-5 rounded-4 mt-4">
                    <h4 className="text-dark fw-bold mb-3">No screenings available right now.</h4>
                    <p className="text-muted">Check back later for new movies and showtimes!</p>
                    {canEdit && (
                        <Link to="/screenings/create" className="btn btn-outline-danger fw-bold mt-3">
                            Create the first screening
                        </Link>
                    )}
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded-4 border overflow-hidden mb-5">
                    <table className="table table-hover align-middle mb-0 bg-white">
                        
                        <thead className="table-dark border-danger" style={{ borderBottomWidth: '3px' }}>
                            <tr>
                                <th className="py-3 ps-4">Movie Title</th>
                                <th className="py-3">Start Time</th>
                                <th className="py-3">Cinema</th>
                                <th className="py-3 text-center pe-4">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {/* Ciclo foreach tradotto in map() per React */}
                            {screenings.map((item) => (
                                <tr key={item.id}>
                                    <td className="fw-bold text-dark ps-4">
                                        {item.movieTitle}
                                    </td>
                                    <td>
                                        {/* Format della data C# in formato leggibile Javascript */}
                                        {new Date(item.startTime).toLocaleString()}
                                    </td>
                                    <td>
                                        {/* Il punto interrogativo previene errori se il cinema è null */}
                                        {item.cinemaName}
                                    </td>
                                    <td className="pe-4">
                                        <div className="d-flex justify-content-center gap-2">
                                            {/*
                                            {canEdit && (
                                                <Link to={`/screenings/edit/${item.id}`} className="btn btn-sm btn-outline-secondary fw-bold px-3">
                                                    Edit
                                                </Link>
                                            )}*/}
                                            
                                            <Link to={`/screenings/details/${item.id}`} className="btn btn-sm btn-danger fw-bold shadow-sm px-3">
                                                Details
                                            </Link>
                                            
                                            {canEdit && (
                                                <Link to={`/screenings/delete/${item.id}`} className="btn btn-sm btn-dark fw-bold px-3">
                                                    Delete
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}