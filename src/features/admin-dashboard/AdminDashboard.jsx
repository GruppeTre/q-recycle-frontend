import Container from "../../components/Container.jsx";
import Header from "../../components/header/Header.jsx";

function AdminDashboard() {
    return (
        <div className="bg-primary-background h-dvh">
            <Header title="Admin"/>
            <Container>
                <h1>New Admin Dashboard!</h1>
            </Container>
        </div>
    );
}

export default AdminDashboard;