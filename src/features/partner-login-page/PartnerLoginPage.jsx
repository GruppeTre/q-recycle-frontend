import {INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import PartnerSignInForm from "./components/PartnerSignInForm.jsx";
import {useNavigate} from "react-router";
import {useState} from "react";
import {auth} from "../../lib/auth.js";
import PageContainer from "../../components/PageContainer.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import UserSignInForm from "../user-login-page/components/UserSignInForm.jsx";

function PartnerLoginPage() {

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (formData) => {

        if (isLoading) {
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const pin = formData.get('pin');
            const email = pin + INTERNAL_EMAIL_SUFFIX;

            await auth.signIn(email, pin);

            navigate('/partner/dashboard');

        } catch (e) {
            console.error(e);
            if (e.code === 'invalid_credentials') {
                setError('Ugyldig pin');
            } else {
                setError('Noget gik galt, prøv igen senere');
            }
        } finally {
            setIsLoading(false);
        }

        /*navigate('/partner/dashboard');*/
    }

    return (
        <PageContainer>
            <div className="mt-gap-xl max-w-md mx-auto">
                <SectionCard>
                    <div className="w-full flex flex-col gap-gap-md items-center px-gap-md py-gap-sm">
                        <PartnerSignInForm callback={handleSignIn}/>
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

export default PartnerLoginPage;