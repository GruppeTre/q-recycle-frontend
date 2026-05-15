import Container from "../../components/Container.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";

function AdminDashboard() {
    return (
        <div className="bg-primary-background h-dvh">
            <Navbar title="Admin"/>
            <Container>
                <p className="text-section-header">New Admin Dashboard!</p>
            </Container>
        </div>
    );
}

export default AdminDashboard;