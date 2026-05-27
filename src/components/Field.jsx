function Field({ label, error, children }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-text-muted font-medium">{label}</span>
            {children}
            {error && <span className="text-xs text-danger">{error}</span>}
        </label>
    )
}

export default Field;