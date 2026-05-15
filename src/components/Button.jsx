function Button({onClick,type = "button", children}) {
    return(
        <button  type={type} onClick={onClick} className="rounded-md px-gap-md py-gap-sm bg-primary text-black cursor-pointer
                 hover:bg-primary-hover">{children}</button>
    );
}

export default Button;
