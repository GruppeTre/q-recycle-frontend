import Input from "../../../components/Input.jsx";
import Button from "../../../components/Button.jsx";

function PartnerSignInForm({ callback }) {

    return (
        <form action={formData => callback(formData)}>
            <div className="flex flex-col gap-gap-sm w-full max-w-sm mx-auto p-lg">
                <Input type="password" minLength="5" placeholder="PIN" name="pin"></Input>
                <Button type="submit">LOG IND</Button>
            </div>
        </form>
    );
}

export default PartnerSignInForm;