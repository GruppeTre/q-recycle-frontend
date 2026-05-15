import {Link} from "react-router";

function NavLinks({navItems}) {
    return (
        <>
            {navItems.map(navItem =>
                <Link key={navItem.label} to={navItem.to}>
                    <div className="flex gap-gap-sm px-gap-md py-gap-sm w-full rounded-md bg-primary hover:bg-primary-hover">
                        {navItem.icon}
                        <p className="text-text-body text-center">{navItem.label}</p>
                    </div>
                </Link>
            )}
        </>
    );
}

export default NavLinks;