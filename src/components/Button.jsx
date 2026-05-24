function Button({onClick,type = "button", children, icon = null, backgroundColor = null}) {
    return(
        <button
            type={type}
            onClick={onClick}
            className={`
                rounded-md
                px-gap-md
                py-gap-sm
                text-text-body
                cursor-pointer
                ${backgroundColor ? `bg-${backgroundColor}` : 'bg-primary'}
                hover:bg-primary-hover
            `}
        >
            <div className="flex justify-center gap-gap-sm whitespace-nowrap">
                {icon && icon}
                {children}
            </div>
        </button>
    );
}

export default Button;
