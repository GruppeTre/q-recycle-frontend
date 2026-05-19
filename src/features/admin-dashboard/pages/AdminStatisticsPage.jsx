import PageContainer from "../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../components/SectionCardExpandable.jsx";
import PickupChart from "../components/LineChart.jsx";
import {pickupData} from "../../../lib/dataSupplier.js";

function AdminStatisticsPage() {



    return (
        <PageContainer>
            <div className="flex flex-col gap-gap-md mt-gap-lg">

                <SectionCardExpandable title="Afhentninger">
                    <PickupChart data={pickupData}/>
                </SectionCardExpandable>

                <SectionCardExpandable
                    title="Indsamlede poser">
                </SectionCardExpandable>

                <SectionCardExpandable title="Udgifter">
                </SectionCardExpandable>

                <SectionCardExpandable title="Chaufføraktivitet">
                </SectionCardExpandable>
            </div>
        </PageContainer>
    );
}

export default AdminStatisticsPage;