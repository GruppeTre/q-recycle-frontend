import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INTERNAL_EMAIL_SUFFIX, role } from "../../config/constants.js";
import UserSignInForm from "./components/UserSignInForm.jsx";
import { passwordSignIn, getRole } from "../../lib/supabaseUtils.js";

const DASHBOARD_BY_ROLE = {
    [role.ADMIN]: '/admin/dashboard',
    [role.DRIVER]: '/driver/dashboard',
};

function UserLoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (formData) => {
        if (isLoading) return;

        const username = formData.get('username')?.trim();
        const password = formData.get('password');

        if (!username || !password) {
            setError('Udfyld både brugernavn og password');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const email = username + INTERNAL_EMAIL_SUFFIX;
            const { data, error: signInError } = await passwordSignIn(email, password);

            if (signInError) {
                if (signInError.code === 'invalid_credentials') {
                    setError('Ugyldigt brugernavn eller password');
                } else {
                    setError('Noget gik galt, prøv igen senere');
                }
                return;
            }

            const userRole = await getRole(data.user.id);
            const destination = DASHBOARD_BY_ROLE[userRole];

            if (!destination) {
                setError('Din konto har ingen tildelt rolle. Kontakt support.');
                return;
            }

            navigate(destination);

        } catch (e) {
            console.error(e);
            setError('Kunne ikke oprette forbindelse');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="w-full flex flex-col items-center mt-4">
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