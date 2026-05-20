import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from './components/EmptyState';
import FeedbackMessage from './components/FeedbackMessage';

export default function UsersList({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'Admin') {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7275/api/Users', {
                    credentials: 'include' // We pass the cookie to prove we are Admin
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else if (response.status === 403) {
                    setError('Access denied. Only administrators can view this page.');
                } else {
                    setError('Error loading users.');
                }
            } catch (err) {
                setError('Server connection error.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser, navigate]);

    if (isLoading) {
        return <div className="text-center mt-5"><h4>Loading users... ⏳</h4></div>;
    }

    return (
        <div className="container mb-5 mt-4">

            <div className="mb-4">
                <h1 className="text-danger fw-bold m-0">👥 User Management</h1>
            </div>

            <FeedbackMessage message={error} type="error" />
            <FeedbackMessage message={successMessage} type="success" />

            {users.length === 0 && !error ? (
                <EmptyState
                    title="No users found."
                    description="The system currently has no registered users."
                />
            ) : (
                <div className="table-responsive shadow-sm rounded-4 border mb-5">
                    <table className="table table-hover align-middle mb-0 bg-white">

                        <thead className="table-dark border-danger" style={{ borderBottomWidth: '3px' }}>
                            <tr>
                                <th className="py-3 ps-4">First Name</th>
                                <th className="py-3">Last Name</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Phone Number</th>
                                <th className="py-3">Role</th>
                                <th className="py-3 text-center pe-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="fw-bold text-dark ps-4">{user.firstName}</td>
                                    <td className="fw-bold text-dark">{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>
                                        {user.role === "Admin" ? (
                                            <span className="badge bg-danger px-2 py-1">{user.role}</span>
                                        ) : (
                                            <span className="badge bg-secondary px-2 py-1">{user.role}</span>
                                        )}
                                    </td>
                                    <td className="pe-4">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to={`/users/edit/${user.id}`} className="btn btn-sm btn-outline-secondary fw-bold px-3">
                                                Edit
                                            </Link>
                                            
                                            <Link to={`/users/delete/${user.id}`} className="btn btn-sm btn-dark fw-bold px-3">
                                                Delete
                                            </Link>
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