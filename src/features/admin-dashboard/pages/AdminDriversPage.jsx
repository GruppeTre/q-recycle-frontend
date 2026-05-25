import PageContainer from "../../../components/PageContainer.jsx";
import SectionCard from "../../../components/SectionCard.jsx";
import {Link} from "react-router";
import Button from "../../../components/Button.jsx";
import {UserPlus} from "lucide-react";
import DriversList from "../components/DriverList.jsx";

function AdminDriversPage() {
    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard headerContent={
                    <div className="flex justify-between items-center">
                        <h2 className="text-section-header">Chauffører</h2>
                        <Link to="new">
                            <Button icon={<UserPlus />}>Opret Chauffør</Button>
                        </Link>
                    </div>
                }>
                    <DriversList />
                </SectionCard>
            </div>
        </PageContainer>
    );
}

export default AdminDriversPage;