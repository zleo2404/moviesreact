export default function Privacy() {
    const title = "Privacy Policy";

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-danger">{title}</h1>
                        <p className="lead text-muted">Your privacy is critically important to us.</p>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-5">
                            <h4 className="fw-bold text-dark">1. Information We Collect</h4>
                            <p className="text-muted">
                                We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our services better. This includes your name, email address, phone number, and booking history when you register and reserve tickets at CinemaTickets.
                            </p>

                            <hr className="my-4 text-light" />

                            <h4 className="fw-bold text-dark">2. How We Use Information</h4>
                            <p className="text-muted">
                                We use the information we collect to operate our platform, process your cinema ticket reservations safely, and send you important updates regarding your account or your upcoming movie screenings.
                            </p>

                            <hr className="my-4 text-light" />

                            <h4 className="fw-bold text-dark">3. Data Security</h4>
                            <p className="text-muted">
                                While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction. Your passwords are encrypted, and your session data is securely stored in your browser.
                            </p>

                            <hr className="my-4 text-light" />

                            <h4 className="fw-bold text-dark">4. Contact Us</h4>
                            <p className="text-muted">
                                If you have any questions about this Privacy Policy or how we handle your data, please contact our support team at <strong>privacy@cinematickets.com</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}