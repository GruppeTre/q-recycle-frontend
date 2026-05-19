import PageContainer from "../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../components/SectionCardExpandable.jsx";
import PickupChart from "../components/PickupChart.jsx";
import {bagsByPartnerData, pickupData} from "../../../lib/dataSupplier.js";
import BagsByPartnerChart from "../components/BagsByPartnerChart.jsx";

function AdminStatisticsPage() {



    return (
        <PageContainer>
            <div className="flex flex-col gap-gap-md mt-gap-lg">

                <SectionCardExpandable title="Afhentninger">
                    <PickupChart data={pickupData}/>
                </SectionCardExpandable>

                <SectionCardExpandable title="Indsamlede poser Pr. virksomhed">
                    <BagsByPartnerChart data={bagsByPartnerData} />
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