function ConfirmationMessage({message}) {
    return (
        <div className="
             bg-primary-background
             text-text-color
             border border-primary
             p-3
             mt-4
             rounded-md
            ">
            {message}
        </div>
    )
}

export default ConfirmationMessage;
