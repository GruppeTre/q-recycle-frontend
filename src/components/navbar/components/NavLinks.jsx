import {Link, useLocation} from "react-router";

function NavLinks({navItems}) {

    const location = useLocation();

    return (
        <>
            {navItems.map(navItem =>
                <Link key={navItem.label} to={navItem.to}>
                    <div className={`flex gap-gap-sm px-gap-md py-gap-sm w-full rounded-md ${navItem.to === location.pathname ? 'bg-primary' : 'bg-surface'}`}>
                        {navItem.icon}
                        <p className="text-text-body text-center">{navItem.label}</p>
                    </div>
                </Link>
            )}
        </>
    );
}

export default NavLinks;