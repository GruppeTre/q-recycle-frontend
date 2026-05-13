function Button({onClick,type = "button", children}) {
    return(
        <button  type={type} onClick={onClick} className="rounded-md pl-3 pr-3 pt-2 pb-2 bg-primary text-black cursor-pointer
                 hover:bg-primary-hover">{children}</button>
    );
}

export default Button;
