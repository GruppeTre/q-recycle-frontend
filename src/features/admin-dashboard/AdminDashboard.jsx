import Container from "../../components/Container.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";

function AdminDashboard() {
    return (
        <div className="bg-primary-background h-dvh">
            <Navbar title="Admin"/>
            <Container>
                <h1>New Admin Dashboard!</h1>
            </Container>
        </div>
    );
}

export default AdminDashboard;