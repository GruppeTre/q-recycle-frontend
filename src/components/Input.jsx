function Input({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full bg-surface-secondary px-gap-md py-gap-sm rounded-md border border-surface-secondary-accent
            focus:outline-1 focus:outline-primary
            ${className}`}
        />
    );
}

export default Input;