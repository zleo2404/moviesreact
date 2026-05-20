import { Link } from 'react-router-dom';

export default function UserRow({ user }) {
    return (
        <tr>
            <td className="fw-bold text-dark ps-4">{user.firstName}</td>
            <td className="fw-bold text-dark">{user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber || 'N/A'}</td>
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
    );
}