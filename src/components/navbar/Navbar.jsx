import HeroIcon from "./components/HeroIcon.jsx";

function Navbar({title, navItems}) {
    return (
        <nav className="bg-background px-gap-lg py-gap-md border-b border-surface">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <HeroIcon />
                        <p>{title}</p>
                    </div>
                    <p>HAMBURGER MENU</p>
                </div>
        </nav>
    );
}

export default Navbar;