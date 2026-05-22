import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {DASHBOARD_BY_ROLE, INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import UserSignInForm from "./components/UserSignInForm.jsx";
import {useAuth} from "../../context/useAuth.js";
import {auth} from "../../lib/auth.js";
import PageContainer from "../../components/PageContainer.jsx";
import SectionCard from "../../components/SectionCard.jsx";



function UserLoginPage() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { session, role } = useAuth();

    useEffect(() => {
        if (session) {
            navigate(DASHBOARD_BY_ROLE[role]);
        }
    }, [session, role])

    const handleSignIn = async (formData) => {

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        const username = formData.get('username')?.trim();
        const password = formData.get('password');

        if (!username || !password) {
            setError('Udfyld venligst alle felter');
            return;
        }

        const email = username + INTERNAL_EMAIL_SUFFIX;
        setError(null);

        try {
            await auth.signIn(email, password);
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
        <PageContainer >
            <div className="mt-gap-xl max-w-md mx-auto">
                <SectionCard>
                    <div className="w-full flex flex-col gap-gap-md items-center px-gap-md py-gap-sm">
                        <UserSignInForm callback={handleSignIn} />
                        {error && (
                            <div role="alert" className="text-sm text-red-500 bg-red-100 px-3 py-2 rounded">
                                {error}
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>
        </PageContainer>
    );
}

export default UserLoginPage;