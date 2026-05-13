function Input({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full bg-gray-100 px-3 py-2 rounded-md border border-gray-200
            focus:outline-1 focus:outline-primary
            ${className}`}
        />
    );
}

export default Input;