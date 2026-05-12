import {INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import {passwordSignIn} from "../../lib/supabaseUtils.js";
import PartnerSignInForm from "./components/PartnerSignInForm.jsx";
import {useNavigate} from "react-router";
import {useState} from "react";

function PartnerLoginPage() {

    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const handleSignIn = async (formData) => {

        setError(null);

        const pin = formData.get('pin');
        const email = pin + INTERNAL_EMAIL_SUFFIX;

        const { data, error} = await passwordSignIn(email, pin);

        if (error) {

            if (error.code === 'invalid_credentials') {
                setError('Ugyldig pin');
            } else {
                setError('Noget gik galt, prøv igen senere');
            }
            return;
        }

        navigate('/partner/dashboard');
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