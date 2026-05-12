function PartnerSignInForm({ callback }) {

    return (
        <form action={formData => callback(formData)}>
            <div className="flex gap-2">
                <input type="password" minLength="5" placeholder="PIN" name="pin" className="bg-gray-200 p-4 h-full rounded-md"></input>
                <button type="submit" className="p-4 bg-blue-400 rounded-md cursor-pointer">LOG IND</button>
            </div>
        </form>
    );
}

export default PartnerSignInForm;