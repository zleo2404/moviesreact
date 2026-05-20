import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function DeleteUser({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isConflict, setIsConflict] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'Admin') {
            navigate('/');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`https://localhost:7123/api/Users/${id}`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setError('User not found or access denied.');
                }
            } catch (err) {
                setError('Server connection error.');
            }
        };

        fetchUser();
    }, [id, currentUser, navigate]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        setError('');
        setIsConflict(false);

        try {
            const response = await fetch(`https://localhost:7123/api/Users/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user.rowVersion), // Sending the concurrency signature
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/users');
            } else if (response.status === 409) {
                setError('Cannot delete: the data has been modified by another user.');
                setIsConflict(true);
                setIsDeleting(false);
            } else {
                const data = await response.json();
                setError(`Error: ${data.message || 'unable to delete.'}`);
                setIsDeleting(false);
            }
        } catch (err) {
            setError('Server connection error.');
            setIsDeleting(false);
        }
    };

    // Reloads the page in case of a conflict
    const handleRefresh = () => window.location.reload();

    if (!user && !error) {
        return <div className="text-center mt-5"><h4>Loading user data... ⏳</h4></div>;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-danger rounded-lg">
                        
                        <div className="card-header bg-danger text-white text-center py-4">
                            <h2 className="card-title mb-0 fw-bold">⚠️ Delete User Account</h2>
                        </div>

                        <div className="card-body p-5 bg-light">
                            <div className="alert alert-warning text-center mb-4 shadow-sm" role="alert">
                                <h4 className="alert-heading fw-bold mb-2">Warning!</h4>
                                <p className="mb-0 text-dark">Are you absolutely sure you want to delete this user? This action cannot be undone and will remove their access to the system.</p>
                            </div>

                            {/* Shows errors and the refresh button if there is a conflict */}
                            {error && (
                                <div className="text-danger text-center mb-4 fw-bold">
                                    ❌ {error}
                                    {isConflict && (
                                        <div className="mt-3">
                                            <button onClick={handleRefresh} className="btn btn-outline-secondary fw-bold">
                                                🔄 Refresh Page
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <h5 className="text-dark fw-bold mb-4 border-bottom border-danger pb-2">User Information</h5>
                            
                            {/* Your grid structure (Description List) */}
                            <dl className="row fs-5">
                                <dt className="col-sm-4 text-dark text-md-end">Full Name</dt>
                                <dd className="col-sm-8 fw-bold text-dark">
                                    {user?.firstName} {user?.lastName}
                                </dd>
                                
                                <dt className="col-sm-4 text-dark text-md-end">Email Address</dt>
                                <dd className="col-sm-8 text-secondary">
                                    {user?.email}
                                </dd>
                                
                                <dt className="col-sm-4 text-dark text-md-end">Phone Number</dt>
                                <dd className="col-sm-8 text-secondary">
                                    {user?.phoneNumber || 'N/A'}
                                </dd>

                                <dt className="col-sm-4 text-dark text-md-end">Password</dt>
                                <dd className="col-sm-8 text-muted">
                                    {user?.password}
                                </dd>

                                <dt className="col-sm-4 text-dark text-md-end">Role</dt>
                                <dd className="col-sm-8">
                                    {user?.role === "Admin" ? (
                                        <span className="badge bg-danger">{user?.role}</span>
                                    ) : (
                                        <span className="badge bg-secondary">{user?.role}</span>
                                    )}
                                </dd>
                            </dl>
                        </div>
                        
                        <div className="card-footer text-center py-4 bg-white border-top-0">
                            <form onSubmit={handleDelete}>
                                <div className="d-flex justify-content-between align-items-center mt-2 px-md-4">
                                    <Link to="/users" className="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
                                        🔙 Cancel
                                    </Link>
                                    <button type="submit" disabled={isDeleting} className="btn btn-danger btn-lg px-5 fw-bold shadow-sm">
                                        {isDeleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
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