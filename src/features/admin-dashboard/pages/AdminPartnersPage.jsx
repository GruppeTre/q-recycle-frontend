import { Link } from "react-router";
import PageContainer from "../../../components/PageContainer.jsx";

function AdminPartnersPage() {
    return (
        <PageContainer>
            <div className="flex justify-between items-center mt-4">
                <h1 className="text-section-header">Partners</h1>
                <Link
                    to="new"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    + Add Partner
                </Link>
            </div>
        </PageContainer>
    );
}

export default AdminPartnersPage;