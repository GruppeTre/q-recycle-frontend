function UserSignInForm({ callback }) {

    return (
        <form action={callback}>
            <div className="flex gap-2">
                <input type="text" placeholder="navn" name="username" className="bg-gray-200 p-4 h-full rounded-md"></input>
                <input type="password" placeholder="password" name="password" className="bg-gray-200 p-4 h-full rounded-md"></input>
                <button type="submit" className="p-4 bg-blue-400 rounded-md cursor-pointer">LOG IND</button>
            </div>
        </form>
    );
}

export default UserSignInForm;