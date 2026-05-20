import { Link } from "react-router";
import PageContainer from "../../../components/PageContainer.jsx";
import Button from "../../../components/Button.jsx";

function AdminPartnersPage() {
    return (
        <PageContainer>
            <div className="flex justify-between items-center mt-4">
                <h1 className="text-section-header">Partners</h1>
                <Link
                    to="new"
                >
                    <Button>+ Add Partner</Button>
                </Link>
            </div>
        </PageContainer>
    );
}

export default AdminPartnersPage;