import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { INTERNAL_EMAIL_SUFFIX, role } from "../../config/constants.js";
import UserSignInForm from "./components/UserSignInForm.jsx";
import { passwordSignIn, getRole } from "../../lib/supabaseUtils.js";
import {supabaseClient} from "../../lib/supabaseClient.js";

const DASHBOARD_BY_ROLE = {
    [role.ADMIN]: '/admin/dashboard',
    [role.DRIVER]: '/driver/dashboard',
};

function UserLoginPage() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        supabaseClient.auth.getSession().then(async ({ data }) => {
            const session = data.session;

            if (session) {
                const role = await getRole(session.user.id);
                navigate(DASHBOARD_BY_ROLE[role]);
            }
        })
    }, [navigate]);

    const handleSignIn = async (formData) => {

        if (isLoading) {
            return;
        }

        const username = formData.get('username')?.trim();
        const password = formData.get('password');

        if (!username || !password) {
            setError('Udfyld venligst alle felter');
            return;
        }

        const email = username + INTERNAL_EMAIL_SUFFIX;
        setError(null);
        setIsLoading(true);

        try {
            const data = await passwordSignIn(email, password);

            const userRole = await getRole(data.user.id);
            const destination = DASHBOARD_BY_ROLE[userRole];

            if (!destination) {
                setError('Din konto har ingen tildelt rolle. Kontakt support.');
                return;
            }

            navigate(destination);

        } catch (e) {
            console.error(e);
            if (e.code === 'invalid_credentials') {
                setError('Ugyldigt brugernavn eller password');
            } else {
                setError('Noget gik galt, prøv igen senere');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="w-full flex flex-col gap-2 items-center mt-4">
                <h2 className="text-lg text-gray-600">Log ind:</h2>
                <UserSignInForm callback={handleSignIn} />
                {error && (
                    <div role="alert" className="text-sm text-red-500 bg-red-100 px-3 py-2 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserLoginPage;