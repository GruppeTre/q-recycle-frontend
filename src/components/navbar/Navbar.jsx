import HeroIcon from "./components/HeroIcon.jsx";
import NavLinks from "./components/NavLinks.jsx";
import {Menu, X} from "lucide-react";
import {useState} from "react";

function Navbar({title, navItems, pendingBags}) {

    const [isOpen, setIsOpen] = useState(false);

    const handleHamburgerToggle = () => {
        setIsOpen(prevState => !prevState);
    }

    return (
        <nav>
            <div className="bg-background px-gap-md py-gap-md border-b border-surface">
                <div className="flex justify-between items-center">
                    <div className="flex gap-gap-md items-center">
                        <HeroIcon pendingBags={pendingBags}/>
                        <h2 className="text-center py-padding text-lg font-semibold">{title}</h2>
                    </div>
                    <div className="hidden md:flex flex-row gap-gap-md justify-between">
                        <NavLinks navItems={navItems}/>
                    </div>
                    <button className="md:hidden cursor-pointer" onClick={handleHamburgerToggle}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
            {isOpen &&
                <div className="md:hidden w-full flex flex-col gap-gap-md bg-background px-gap-lg py-gap-md border-b border-surface ">
                    <NavLinks navItems={navItems}/>
                </div>
            }
        </nav>
    );
}

export default Navbar;