import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackMessage from './components/FeedbackMessage';

export default function ConfirmDeletion() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reservation, setReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadReservationDetails = useCallback(async () => {
        try {
            const response = await fetch(`https://localhost:7275/api/Reservations/${id}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setReservation(data);
            } else {
                setError(data.message || 'Error loading reservation details.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadReservationDetails();
    }, [loadReservationDetails]);

    const handleDelete = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`https://localhost:7275/api/Reservations/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                navigate(`/screenings/details/${reservation.screeningId}`);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to cancel reservation.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center mt-5">⏳ Loading...</div>;
    if (!reservation) return <FeedbackMessage message={error} type="error" />;

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-danger text-white text-center py-4">
                            <h2 className="card-title mb-0 fw-bold">Cancel Reservation</h2>
                        </div>
                        
                        <div className="card-body p-5 bg-light text-center">
                            
                            <FeedbackMessage message={error} type="error" />

                            <h4 className="mb-4 text-dark">Are you sure you want to cancel this ticket?</h4>
                            <h3 className="text-danger fw-bold">🎬 {reservation.movieTitle}</h3>
                            <p className="fs-5 text-secondary">{new Date(reservation.startTime).toLocaleString()}</p>
                            <p className="fs-5 text-secondary">Cinema: {reservation.cinemaName}</p>

                            <hr className="my-4" />

                            <h4 className="text-dark">Your Seat:</h4>
                            <div className="display-4 fw-bold text-danger mb-4">
                                Row {reservation.rowX} - Seat {reservation.seatY}
                            </div>

                            <div className="d-flex justify-content-center gap-3 mt-4">
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="btn btn-dark px-4 fw-bold"
                                    disabled={isSubmitting}
                                >
                                    Keep Ticket
                                </button>
                                
                                <button 
                                    onClick={handleDelete} 
                                    className="btn btn-danger px-4 fw-bold shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Canceling...' : 'Yes, Cancel it'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}