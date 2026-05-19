import PageContainer from "../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../components/SectionCardExpandable.jsx";
import PickupChart from "../components/PickupChart.jsx";
import {bagsByPartnerData, expenses, pickupData} from "../../../lib/dataSupplier.js";
import BagsByPartnerChart from "../components/BagsByPartnerChart.jsx";
import ExpensesChart from "../components/ExpensesChart.jsx";

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

                <SectionCardExpandable title="Omkostninger">
                    <h2 className="text-section-header">Total omkostninger: {expenses.reduce((partialSum, expense) => partialSum + expense.amount, 0)}kr</h2>
                    <ExpensesChart data={expenses}/>
                </SectionCardExpandable>
            </div>
        </PageContainer>
    );
}

export default AdminStatisticsPage;