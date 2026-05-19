function Input({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full bg-gray-100 px-gap-md py-gap-sm rounded-md border border-gray-200
            focus:outline-1 focus:outline-primary
            ${className}`}
        />
    );
}

export default Input;