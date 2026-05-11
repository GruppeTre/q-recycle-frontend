import {INTERNAL_EMAIL_SUFFIX} from "../../config/constants.js";
import {passwordSignIn} from "../../lib/supabaseUtils.js";

function FrontPage() {


    const handleSignIn = async (formData) => {

        const pin = formData.get('pin');
        const email = pin + INTERNAL_EMAIL_SUFFIX;

        const data = await passwordSignIn(email, pin);

        console.log(JSON.stringify(data));

        console.log(JSON.stringify(data));
    }
    return (
        <>
            <form action={formData => handleSignIn(formData)}>
                <input type={'text'} placeholder={'PIN'} name={'pin'}></input>
                <button type={'submit'}>LOG IND</button>
            </form>
        </>
    );
}

export default FrontPage;