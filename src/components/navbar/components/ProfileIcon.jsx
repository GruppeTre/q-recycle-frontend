import {UserCog} from "lucide-react";
import {useState} from "react";
import Button from "../../Button.jsx";
import {auth} from "../../../lib/auth.js";

function ProfileIcon({ pendingBags }) {

    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <>
            <div className="relative bg-primary rounded-lg p-gap-sm cursor-pointer" onClick={() => setShowDropdown(prevState => !prevState)}>
                <UserCog />

                {pendingBags > 0 && (
                    <span className="absolute -top-1 -right-3 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {pendingBags > 99 ? '99+' : pendingBags}
                    </span>
                )}
            </div>
            {showDropdown &&
                <div className="rounded-md bg-surface-secondary absolute translate-y-13 flex flex-col gap-gap-sm px-gap-md py-gap-sm">
                    <Button onClick={auth.signOut}>Log Ud</Button>
                </div>
            }
        </>
    );
}

export default ProfileIcon;