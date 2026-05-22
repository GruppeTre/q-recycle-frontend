import PageContainer from "../../components/PageContainer.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import RoutesList from "./components/RoutesList.jsx";
import {Link} from "react-router";
import Button from "../../components/Button.jsx";
import {MapPlus} from "lucide-react";

function DriverRoutePage() {

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard>
                    <div className="flex justify-between items-center">
                        <h2 className="text-section-header">Rute Oversigt</h2>
                        <Link to="/driver/routes/route-planner">
                            <Button icon={<MapPlus />}>Start Rute</Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-gap-sm">
                        <RoutesList />
                    </div>
                </SectionCard>
            </div>
        </PageContainer>
    )
}

export default DriverRoutePage;