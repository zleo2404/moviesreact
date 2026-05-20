import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from './components/EmptyState'
import ScreeningRow from './components/ScreeningRow';
import { useAuth } from './AuthContext';

export default function Screenings() {

    const { user: currentUser } = useAuth();
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const canEdit = currentUser && currentUser.role === 'Admin';

    useEffect(() => {
        const fetchScreenings = async () => {
            try {
                const response = await fetch('https://localhost:7275/api/Screenings');

                if (response.ok) {
                    const data = await response.json();
                    setScreenings(data);
                } else {
                    setError('Unable to load the schedule.');
                }
            } catch (err) {
                setError('Server connection error.');
            } finally {
                setLoading(false);
            }
        };

        fetchScreenings();
    }, []);

    if (loading) {
        return <h3 className="text-center mt-5">Loading movies... ⏳</h3>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <div className="container mb-4 mt-4">
            <div className="mb-4 mt-4">
                <h1 className="text-danger fw-bold m-0">🎬 Film Screenings</h1>
            </div>

            {canEdit && (
                <Link to="/screenings/create" className="btn btn-danger fw-bold shadow-sm px-4 mb-3">
                    🍿 Create New
                </Link>
            )}

            {screenings.length === 0 ? (
                <EmptyState
                    title="No screenings available right now."
                    description="Check back later for new movies and showtimes!"
                >
                    {canEdit && (
                        <Link to="/screenings/create" className="btn btn-outline-danger fw-bold">
                            Create the first screening
                        </Link>
                    )}
                </EmptyState>
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
                            {screenings.map((item) => (
                                <ScreeningRow
                                    key={item.id}
                                    item={item}
                                    canEdit={canEdit}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}