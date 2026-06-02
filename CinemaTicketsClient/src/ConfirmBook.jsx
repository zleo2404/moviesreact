import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import FeedbackMessage from './components/FeedbackMessage';

export default function ConfirmBooking() {
    //route (/book/:id)
    const { id } = useParams();
    
    //query string (?row=2&seat=5)
    const [searchParams] = useSearchParams();
    const rowX = searchParams.get('row');
    const seatY = searchParams.get('seat');
    
    const navigate = useNavigate();

    const [screening, setScreening] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadScreeningDetails = useCallback(async () => {
        try {
            const response = await fetch(`https://localhost:7275/api/Screenings/${id}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setScreening(data);
            } else {
                setError(data.message || 'Error loading details.');
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

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('https://localhost:7275/api/Reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    screeningId: parseInt(id), 
                    rowX: parseInt(rowX), 
                    seatY: parseInt(seatY) 
                }),
                credentials: 'include'
            });

            if (response.ok) {
                navigate(`/screenings/details/${id}`);
            } else {
                const data = await response.json();
                setError(data.message || 'This seat is already taken or unavailable.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center mt-5">⏳ Loading...</div>;
    if (!screening) return <FeedbackMessage message={error} type="error" />;

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        
                        <div className="card-header bg-success text-white text-center py-4">
                            <h2 className="card-title mb-0 fw-bold">Confirm Booking</h2>
                        </div>
                        
                        <div className="card-body p-5 bg-light text-center">
                            
                            <FeedbackMessage message={error} type="error" />

                            <h4 className="mb-4 text-dark">You are about to book a seat for:</h4>
                            <h3 className="text-danger fw-bold">🎬 {screening.movieTitle}</h3>
                            <p className="fs-5 text-secondary">{new Date(screening.startTime).toLocaleString()}</p>
                            <p className="fs-5 text-secondary">Cinema: {screening.cinema?.name}</p>

                            <hr className="my-4" />

                            <h4 className="text-dark">Selected Seat:</h4>
                            <div className="display-4 fw-bold text-success mb-4">
                                Row {rowX} - Seat {seatY}
                            </div>

                            <div className="d-flex justify-content-center gap-3 mt-4">
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="btn btn-dark btn-lg px-4 fw-bold"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                
                                <button 
                                    onClick={handleConfirmBooking} 
                                    className="btn btn-success btn-lg px-4 fw-bold shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}