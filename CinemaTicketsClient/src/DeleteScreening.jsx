import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteCard from './components/DeleteCard';

export default function DeleteScreening({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [screening, setScreening] = useState(null);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchScreening = async () => {
            try {
                const response = await fetch(`https://localhost:7275/api/Screenings/${id}`);
                if (response.ok) setScreening(await response.json());
                else setError('Screening not found or eliminated.');
            } catch (err) { setError('Error connecting to the server.'); }
        };
        fetchScreening();
    }, [id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true); setError('');
        try {
            const response = await fetch(`https://localhost:7275/api/Screenings/${id}`, {
                method: 'DELETE', credentials: 'include'
            });
            if (response.ok) navigate('/screenings');
            else {
                const data = await response.json().catch(() => ({}));
                setError(data.message || 'Error deleting the screening');
            }
        } catch (err) { setError('Error connecting to the server.'); }
        finally { setIsDeleting(false); }
    };

    if (!currentUser || currentUser.role !== 'Admin') {
        return <h3 className="text-center mt-5 text-danger">Access Denied. Only admins can delete.</h3>;
    }

    if (!screening && !error) return <h3 className="text-center mt-5">Uploading screenings... ⏳</h3>;

    return (
        <DeleteCard 
            title="🗑️ Delete Screening"
            cancelLink="/screenings"
            handleDelete={handleDelete}
            isDeleting={isDeleting}
            error={error}
        >
            <h5 className="text-dark fw-bold mb-4 border-bottom border-danger pb-2">Screening Information</h5>
            <dl className="row fs-5">
                <dt className="col-sm-4 text-dark text-md-end">Movie Title</dt>
                <dd className="col-sm-8 fw-bold text-danger">{screening?.movieTitle}</dd>
                <dt className="col-sm-4 text-dark text-md-end">Start Time</dt>
                <dd className="col-sm-8 text-secondary">🗓️ {screening ? new Date(screening.startTime).toLocaleString() : ''}</dd>
                <dt className="col-sm-4 text-dark text-md-end">Cinema</dt>
                <dd className="col-sm-8 text-secondary">🍿 {screening?.cinemaName || 'N/A'}</dd>
            </dl>
        </DeleteCard>
    );
}