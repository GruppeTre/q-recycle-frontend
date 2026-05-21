import PageContainer from "../../components/PageContainer.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import RoutesList from "./components/RoutesList.jsx";

function DriverRoutePage() {

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard>
                    <h1 className="text-section-header">Rute Oversigt</h1>
                    <RoutesList />
                </SectionCard>
            </div>
        </PageContainer>
    )
}

export default DriverRoutePage;