import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteCard from './components/DeleteCard';
import { useAuth } from './AuthContext';

export default function DeleteScreening() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [screening, setScreening] = useState(null);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConflict, setIsConflict] = useState(false);

    const loadScreeningData = useCallback(async () => {
        try {
            const response = await fetch(`/api/Screenings/${id}`);
            
            if (response.ok) {
                setScreening(await response.json());
                setError('');
                setIsConflict(false);
            } else {
                setError('Screening not found or eliminated.');
            }
        } catch (err) { 
            setError('Error connecting to the server.'); 
        }
    }, [id]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'Admin') {
            navigate('/');
            return;
        }

        loadScreeningData();
    }, [currentUser, navigate, loadScreeningData]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true); 
        setError('');
        setIsConflict(false);
        
        try {
            const response = await fetch(`/api/Screenings/${id}`, {
                method: 'DELETE', 
                credentials: 'include'
            });
            
            if (response.ok) {
                navigate('/screenings');
            } else if (response.status === 409) {
                setError('Cannot delete: the data has been modified by another user.');
                setIsConflict(true);
            } else {
                const data = await response.json().catch(() => ({}));
                setError(data.message || 'Error deleting the screening');
            }
        } catch (err) { 
            setError('Error connecting to the server.'); 
        } finally { 
            setIsDeleting(false); 
        }
    };

    const handleRefresh = () => {
        loadScreeningData();
    };

    if (!screening && !error) return <h3 className="text-center mt-5">Loading screening data... ⏳</h3>;

    return (
        <DeleteCard 
            title="🗑️ Delete Screening"
            cancelLink="/screenings"
            handleDelete={handleDelete}
            isDeleting={isDeleting}
            error={error}
            isConflict={isConflict}
            onRefresh={handleRefresh}
            disableDelete={!screening}
        >
            <h5 className="text-dark fw-bold mb-4 border-bottom border-danger pb-2">Screening Information</h5>
            
            <dl className="row fs-5">
                <dt className="col-sm-4 text-dark text-md-end">Movie Title</dt>
                <dd className="col-sm-8 fw-bold text-danger">
                    {screening?.movieTitle}
                </dd>
                
                <dt className="col-sm-4 text-dark text-md-end">Start Time</dt>
                <dd className="col-sm-8 text-secondary">
                    🗓️ {screening ? new Date(screening.startTime).toLocaleString() : ''}
                </dd>
                
                <dt className="col-sm-4 text-dark text-md-end">Cinema</dt>
                <dd className="col-sm-8 text-secondary">
                    🍿 {screening?.cinemaName || 'N/A'}
                </dd>
            </dl>
        </DeleteCard>
    );
}