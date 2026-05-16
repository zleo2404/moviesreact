import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-top footer text-muted py-3 mt-auto bg-light">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div>
                    &copy; {new Date().getFullYear()} - <span className="fw-bold">CinemaTickets</span>
                </div>
                <div>
                    <Link to="/privacy" className="text-decoration-none text-muted hover-dark">Privacy Policy</Link>
                    <span className="mx-2">|</span>
                    <Link to="/" className="text-decoration-none text-muted hover-dark">Home</Link>
                </div>
            </div>
        </footer>
    );
}