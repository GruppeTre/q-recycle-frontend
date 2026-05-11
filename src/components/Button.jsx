function Button({onClick,type = "button", children}) {
    return(
        <button  type={type} onClick={onClick} className="rounded-md pl-3 pr-3 pt-2 pb-2 bg-blue-300 cursor-pointer hover:bg-blue-400" >{children}</button>
    );
}

export default Button;