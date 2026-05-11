import {INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import {passwordSignIn} from "../../lib/supabaseUtils.js";
import PartnerSignInForm from "./components/PartnerSignInForm.jsx";

function PartnerLoginPage() {

    const handleSignIn = async (formData) => {

        const pin = formData.get('pin');
        const email = pin + INTERNAL_EMAIL_SUFFIX;

        const data = await passwordSignIn(email, pin);

        console.log(JSON.stringify(data));
    }

    return (
        <div className={'w-lg mx-auto'}>
            <div className={'w-full flex flex-col gap-2 items-center mt-4'}>
                <h2 className={'text-lg text-gray-600'}>Indtast din pinkode:</h2>
                <PartnerSignInForm callback={(formData) => handleSignIn(formData)}/>
            </div>
        </div>
    );
}

export default PartnerLoginPage;