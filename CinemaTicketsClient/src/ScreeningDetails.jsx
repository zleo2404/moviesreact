import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ScreeningDetails({ currentUser }) {
    const { id } = useParams();
    
    const [screening, setScreening] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const canEdit = currentUser && currentUser.role === 'Admin';

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`https://localhost:7275/api/Screenings/${id}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setScreening(data);
                } else {
                    setError('Unable to load screening details.');
                }
            } catch (err) {
                setError('Server connection error.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return <h3 className="text-center mt-5">Loading details... ⏳</h3>;
    }

    if (error || !screening) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">{error || "Screening not found."}</div>
                <Link to="/screenings" className="btn btn-dark mt-3">🔙 Back to List</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0 rounded-lg">

                        <div className="card-header bg-dark text-white text-center py-4 border-bottom border-danger border-3">
                            <h2 className="card-title mb-0 fw-bold">🎬 Screening Details</h2>
                        </div>

                        <div className="card-body p-5 bg-light">
                            <h4 className="text-danger fw-bold mb-4 border-bottom border-danger pb-2">
                                🎟️ Ticket Information
                            </h4>

                            <dl className="row fs-5 mt-4">
                                <dt className="col-sm-4 text-dark text-md-end">Movie Title</dt>
                                <dd className="col-sm-8 fw-bold text-danger">
                                    {screening.movieTitle}
                                </dd>

                                <dt className="col-sm-4 text-dark text-md-end mt-3">Start Time</dt>
                                <dd className="col-sm-8 text-secondary mt-3">
                                    🗓️ {new Date(screening.startTime).toLocaleString()}
                                </dd>

                                <dt className="col-sm-4 text-dark text-md-end mt-3">Cinema</dt>
                                <dd className="col-sm-8 text-secondary mt-3">
                                    🍿 {screening.cinemaName || 'N/A'}
                                </dd>
                            </dl>
                        </div>

                        <div className="card-footer text-center py-4 bg-white border-top-0">
                            <Link to="/screenings" className="btn btn-dark btn-lg px-4 fw-bold shadow-sm me-2">
                                🔙 Back to List
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}