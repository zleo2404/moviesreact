export default function FormInput({ 
    label, 
    icon, 
    type = "text",
    name, 
    value, 
    onChange, 
    placeholder, 
    required,
    pattern,
    title
}) {
    return (
        <div className="mb-3">
            <label className="form-label fw-bold text-secondary">{label}</label>
            <div className="input-group">
                <span className="input-group-text bg-white border-end-0">{icon}</span>
                <input 
                    type={type} 
                    className="form-control border-start-0" 
                    name={name}
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange} 
                    required={required} 
                    pattern={pattern}
                    title={title}
                />
            </div>
        </div>
    );
}