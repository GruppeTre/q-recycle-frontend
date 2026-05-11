import { INTERNAL_EMAIL_SUFFIX } from "../../config/constants.js";
import { passwordSignIn } from "../../lib/supabaseUtils.js";

function DriverAdminLoginPage() {
    const handleSignIn = async (formData) => {
        const username = formData.get('username');
        const password = formData.get('password');
        const email = username + INTERNAL_EMAIL_SUFFIX;

        const data = await passwordSignIn(email, password);

        console.log('Logget ind:', JSON.stringify(data));
    };

    return (
        <form action={handleSignIn}>
            <input type="text" placeholder="Navn" name="username" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">LOG IND</button>
        </form>
    );
}

export default DriverAdminLoginPage;