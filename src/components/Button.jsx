function Button({onClick, text="Default"}) {
    return(
        <button onClick={onClick} className="rounded-md pl-3 pr-3 pt-2 pb-2 bg-blue-300 cursor-pointer hover:bg-blue-400" >{text}</button>
    );
}

export default Button;