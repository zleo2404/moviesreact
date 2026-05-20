import { Link } from 'react-router-dom';
import FeedbackMessage from './FeedbackMessage';

export default function DeleteCard({ 
    title, 
    cancelLink, 
    handleDelete, 
    isDeleting, 
    error, 
    isConflict, 
    onRefresh,
    disableDelete,
    children 
}) {
    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-danger rounded-lg">
                        
                        <div className="card-header bg-danger text-white text-center py-4">
                            <h2 className="card-title mb-0 fw-bold">{title}</h2>
                        </div>
                        
                        <div className="card-body p-5 bg-light">
                            <div className="alert alert-warning text-center mb-4 shadow-sm" role="alert">
                                <h4 className="alert-heading fw-bold mb-2">⚠️ Warning!</h4>
                                <p className="mb-0 text-dark">
                                    Are you absolutely sure you want to delete this item? This action cannot be undone.
                                </p>
                            </div>

                            <FeedbackMessage message={error} type="error" />
                            
                            {isConflict && (
                                <div className="text-center mt-2 mb-4">
                                    <button onClick={onRefresh} type="button" className="btn btn-outline-danger fw-bold">
                                        🔄 Refresh Page
                                    </button>
                                </div>
                            )}
                            
                            {children}

                        </div>
                        
                        <div className="card-footer text-center py-4 bg-white border-top-0">
                            <form onSubmit={handleDelete}>
                                <div className="d-flex justify-content-between align-items-center mt-2 px-md-4">
                                    <Link to={cancelLink} className="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
                                        🔙 Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        className="btn btn-danger btn-lg px-5 fw-bold shadow-sm"
                                        disabled={isDeleting || disableDelete}
                                    >
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