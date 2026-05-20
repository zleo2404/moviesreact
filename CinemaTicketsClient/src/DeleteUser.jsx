import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteCard from './components/DeleteCard';
import { useAuth } from './AuthContext'; 

export default function DeleteUser() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isConflict, setIsConflict] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadUserData = useCallback(async () => {
        try {
            const response = await fetch(`https://localhost:7275/api/Users/${id}`, { 
                credentials: 'include' 
            });
            
            if (response.ok) {
                setUser(await response.json());
                setError('');
                setIsConflict(false); 
            } else {
                setError('User not found or access denied.');
            }
        } catch (err) { 
            setError('Server connection error.'); 
        }
    }, [id]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'Admin') {
            navigate('/');
            return;
        }
        
        loadUserData();
    }, [currentUser, navigate, loadUserData]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true); 
        setError(''); 
        setIsConflict(false);
        
        try {
            const response = await fetch(`https://localhost:7275/api/Users/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user?.rowVersion || user?.RowVersion || ''), 
                credentials: 'include'
            });
            
            if (response.ok) {
                navigate('/users');
            } else if (response.status === 409) {
                setError('Cannot delete: the data has been modified by another user.');
                setIsConflict(true);
            } else {
                const data = await response.json();
                setError(`Error: ${data.message || 'unable to delete.'}`);
            }
        } catch (err) { 
            setError('Server connection error.'); 
        } finally { 
            setIsDeleting(false); 
        }
    };

    const handleRefresh = () => {
        loadUserData();
    };

    if (!user && !error) return <div className="text-center mt-5"><h4>Loading user data... ⏳</h4></div>;

    return (
        <DeleteCard 
            title="⚠️ Delete User Account"
            cancelLink="/users"
            handleDelete={handleDelete}
            isDeleting={isDeleting}
            error={error}
            isConflict={isConflict}
            onRefresh={handleRefresh}
            disableDelete={!user}
        >
            <h5 className="text-dark fw-bold mb-4 border-bottom border-danger pb-2">User Information</h5>
            <dl className="row fs-5">
                <dt className="col-sm-4 text-dark text-md-end">Full Name</dt>
                <dd className="col-sm-8 fw-bold text-dark">{user?.firstName} {user?.lastName}</dd>
                
                <dt className="col-sm-4 text-dark text-md-end">Email Address</dt>
                <dd className="col-sm-8 text-secondary">{user?.email}</dd>
                
                <dt className="col-sm-4 text-dark text-md-end">Role</dt>
                <dd className="col-sm-8">
                    <span className={`badge ${user?.role === "Admin" ? "bg-danger" : "bg-secondary"}`}>
                        {user?.role}
                    </span>
                </dd>
            </dl>
        </DeleteCard>
    );
}