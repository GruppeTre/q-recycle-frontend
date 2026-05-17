function Button({onClick,type = "button", children}) {
    return(
        <button  type={type} onClick={onClick} className="rounded-md px-gap-md py-gap-sm bg-primary text-text-body cursor-pointer
                 hover:bg-primary-hover">{children}</button>
    );
}

export default Button;
