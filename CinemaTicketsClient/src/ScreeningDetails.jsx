import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import FeedbackMessage from './components/FeedbackMessage';

export default function ScreeningDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [screening, setScreening] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadScreeningDetails = useCallback(async () => {
        try {
            const response = await fetch(`https://localhost:7275/api/Screenings/${id}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setScreening(data);
            } else {
                setError(data.message || 'Error loading screening details.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadScreeningDetails();
    }, [loadScreeningDetails]);

    const renderSeat = (row, seat) => {
        const reservation = screening.reservations?.find(
            (r) => r.rowX === row && r.seatY === seat
        );

        if (reservation) {
            if (user && String(reservation.userId) === String(user.id)) {
                return (
                    <button 
                        key={`${row}-${seat}`}
                        onClick={() => navigate(`/reservations/delete/${reservation.id}`)}
                        className="btn btn-sm btn-danger fw-bold shadow-sm" 
                        style={{ width: '50px', height: '50px' }}
                        title="Cancel your reservation"
                    >
                        You
                    </button>
                );
            } else {
                return (
                    <button 
                        key={`${row}-${seat}`}
                        className="btn btn-sm btn-secondary fw-bold disabled" 
                        style={{ width: '50px', height: '50px' }}
                    >
                        X
                    </button>
                );
            }
        }

        return (
            <button 
                key={`${row}-${seat}`}
                onClick={() => navigate(`/reservations/book/${screening.id}?row=${row}&seat=${seat}`)}
                className={`btn btn-sm btn-outline-success fw-bold ${!user ? 'disabled' : ''}`}
                style={{ width: '50px', height: '50px' }}
                disabled={!user}
            >
                {seat}
            </button>
        );
    };

    if (isLoading) return <div className="text-center mt-5">⏳ Loading...</div>;
    if (!screening) return <FeedbackMessage message={error} type="error" />;

    const canEdit = user && user.role === 'Admin';

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-dark text-white text-center py-4 border-bottom border-danger border-3">
                            <h2 className="card-title mb-0 fw-bold">🎬 Screening Details</h2>
                        </div>

                        <div className="card-body p-5 bg-light">
                            <div className="row mb-5">
                                <div className="col-md-6">
                                    <h4 className="text-danger fw-bold mb-4">🎟️ Ticket Information</h4>
                                    <dl className="row fs-5">
                                        <dt className="col-sm-4 text-dark">Movie</dt>
                                        <dd className="col-sm-8 fw-bold text-danger">{screening.movieTitle}</dd>
                                        
                                        <dt className="col-sm-4 text-dark">Start Time</dt>
                                        <dd className="col-sm-8 text-secondary">{new Date(screening.startTime).toLocaleString()}</dd>
                                        
                                        <dt className="col-sm-4 text-dark">Cinema</dt>
                                        <dd className="col-sm-8 text-secondary">{screening.cinema?.name}</dd>
                                    </dl>
                                </div>

                                <div className="col-md-6 border-start border-2">
                                    <h4 className="text-dark fw-bold mb-4">📋 Seat Legend</h4>
                                    <div className="d-flex align-items-center mb-3">
                                        <button className="btn btn-sm btn-outline-success fw-bold me-3" style={{ width: '45px' }} disabled>Nr.</button>
                                        <span className="fs-5 text-secondary">Available (Click to book)</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                        <button className="btn btn-sm btn-danger fw-bold shadow-sm me-3" style={{ width: '45px' }} disabled>You</button>
                                        <span className="fs-5 text-secondary">Your Seat (Click to cancel)</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-sm btn-secondary fw-bold me-3" style={{ width: '45px' }} disabled>X</button>
                                        <span className="fs-5 text-secondary">Occupied</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="text-danger border-2 mb-5 opacity-25" />

                            <h4 className="text-center text-danger fw-bold mb-4">💺 Seat Map</h4>

                            {!user && (
                                <div className="alert alert-warning text-center fw-bold fs-5 mb-4 shadow-sm">
                                    ⚠️ Please log in to book a seat!
                                </div>
                            )}

                            <div className="text-center bg-white p-4 rounded-4 shadow-sm border border-2">
                                <div className="bg-dark text-white rounded-pill py-2 mb-5 mx-auto shadow-sm" style={{ width: '60%', borderBottom: '4px solid #dc3545' }}>
                                    <h5 className="mb-0" style={{ letterSpacing: '5px' }}>SCREEN</h5>
                                </div>

                                <div className="overflow-auto pb-3 px-2" style={{ maxWidth: '100%' }}>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                        {screening.cinema ? (
                                            Array.from({ length: screening.cinema.rows }).map((_, rowIndex) => {
                                                const rowNum = rowIndex + 1;
                                                return (
                                                    <div key={`row-${rowNum}`} className="d-flex justify-content-center gap-2 align-items-center">
                                                        <span className="fw-bold text-dark me-2 fs-5" style={{ width: '40px' }}>
                                                            R{rowNum}
                                                        </span>
                                                        
                                                        {Array.from({ length: screening.cinema.seatsPerRow }).map((_, seatIndex) => {
                                                            const seatNum = seatIndex + 1;
                                                            return renderSeat(rowNum, seatNum);
                                                        })}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-danger fw-bold">Error: Cinema seat layout is not defined.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer text-center py-4 bg-white border-top-0">
                            <Link to="/screenings" className="btn btn-dark btn-lg px-4 fw-bold shadow-sm me-2">🔙 Back to List</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}