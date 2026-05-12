import {INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import {passwordSignIn} from "../../lib/supabaseUtils.js";
import UserSignInForm from "./components/UserSignInForm.jsx";
import {useNavigate} from "react-router";
import {useState} from "react";

const DASHBOARD_BY_ROLE = {
    admin: '/admin/dashboard',
    driver: '/driver/dashboard',
};

function UserLoginPage() {

    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const handleSignIn = async (formData) => {

        setError(null);

        const username = formData.get('username')?.trim();
        const password = formData.get('password');
        const email = username + INTERNAL_EMAIL_SUFFIX;

        const {data, error} = await passwordSignIn(email, password);

        if (error) {

            if (error.code === 'invalid_credentials') {
                setError('Ugyldigt password');
            } else {
                setError('Noget gik galt, prøv igen senere');
            }
            return;
        }

        const role = data.user.app_metadata?.role;
        const destination = DASHBOARD_BY_ROLE[role];

        if (!destination) {
            setError('Din konto har ingen tildelt rolle. Kontakt support.');
            return;
        }

        navigate(destination);

    };

    return (
        <div className="w-lg mx-auto">
            <div className="w-full flex flex-col gap-2 items-center mt-4">
                <h2 className="text-lg text-gray-600">Indtast password:</h2>
                <UserSignInForm callback={handleSignIn}/>
                {error && <div className="text-sm text-red-500 bg-red-100 px-3 py-2 rounded">{error}</div>}
            </div>
        </div>
    );
}

export default UserLoginPage;