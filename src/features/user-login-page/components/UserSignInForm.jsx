import Input from "../../../components/Input.jsx";
import Button from "../../../components/Button.jsx";

function UserSignInForm({ callback }) {

    return (
        <form action={callback} className="flex flex-col gap-gap-sm w-full max-w-sm mx-auto p-lg">
            <Input type="text" placeholder="Brugernavn" name="username" />
            <Input type="password" placeholder="Adgangskode" name="password" />
            <Button type="submit">LOG IND</Button>
        </form>
    );
}

export default UserSignInForm;