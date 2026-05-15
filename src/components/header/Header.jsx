import Container from "../Container.jsx";

function Header({title, navItems}) {
    return (
        <nav className="bg-background">
            <Container>
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <p>LOGO</p>
                        <p>{title}</p>
                    </div>
                    <p>HAMBURGER MENU</p>
                </div>
            </Container>
        </nav>
    );
}

export default Header;