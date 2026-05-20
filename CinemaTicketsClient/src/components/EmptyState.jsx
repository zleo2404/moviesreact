export default function EmptyState({ title, description, children }) {
    return (
        <div className="alert alert-light border border-danger shadow-sm text-center py-5 rounded-4 mt-4">
            <h4 className="text-dark fw-bold mb-3">{title}</h4>
            
            {description && <p className="text-muted">{description}</p>}
            
            {children && <div className="mt-3">{children}</div>}
        </div>
    );
}