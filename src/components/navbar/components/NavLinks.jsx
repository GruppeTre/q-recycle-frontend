import {Link, useLocation} from "react-router";

function NavLinks({navItems, onClick}) {

    const location = useLocation();

    return (
        <>
            {navItems.map(navItem =>
                <Link key={navItem.label} onClick={onClick} to={navItem.to} className="w-full md:max-w-48">
                    <div className={`flex gap-gap-sm px-gap-md py-gap-sm rounded-md whitespace-nowrap ${navItem.to === location.pathname ? 'bg-primary' : ''}`}>
                        <span className="shrink-0">{navItem.icon}</span>
                        <div className="overflow-hidden">
                            <p className="text-text-body text-center">{navItem.label}</p>
                        </div>
                    </div>
                </Link>
            )}
        </>
    );
}

export default NavLinks;