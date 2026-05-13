import {INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import PartnerSignInForm from "./components/PartnerSignInForm.jsx";
import {useNavigate} from "react-router";
import {useState} from "react";
import {auth} from "../../lib/auth.js";

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
    }

    return (
        <div className="w-lg mx-auto">
            <div className="w-full flex flex-col gap-2 items-center mt-4">
                <h2 className="text-lg text-gray-600">Indtast din pinkode:</h2>
                <PartnerSignInForm callback={handleSignIn}/>
                {error && <div className="text-sm text-red-500 bg-red-100 px-3 py-2 rounded">{error}</div>}
            </div>
        </div>
    );
}

export default PartnerLoginPage;