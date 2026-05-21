import PageContainer from "../../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../../components/SectionCardExpandable.jsx";
import PickupChart from "../../components/PickupChart.jsx";
import {mockExpenses, statisticsApi} from "./lib/statisticsApi.js";
import BagsByPartnerChart from "../../components/BagsByPartnerChart.jsx";
import ExpensesChart from "../../components/ExpensesChart.jsx";
import {useState} from "react";
import {timeRange} from "./config/timeRange.js";
import SectionCard from "../../../../components/SectionCard.jsx";

function AdminStatisticsPage() {

    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange.LAST_MONTH);

    const handleTimeRangeChange = (e) => {
        const selectedLabel = e.target.value;

        setSelectedTimeRange(
            Object.values(timeRange).find(
                element => element.label === selectedLabel
            )
        );
    }

    return (
        <PageContainer>
            <div className="flex flex-col gap-gap-md mt-gap-lg">

                <SectionCard title="Indstillinger">
                    <div className="flex gap-gap-lg">
                        <p>Select time range:</p>
                        <select
                            value={selectedTimeRange.label}
                            onChange={(e) => handleTimeRangeChange(e)}
                        >
                            {Object.values(timeRange).map(tr =>
                                <option key={tr.label} value={tr.label}>{tr.label}</option>
                            )}
                        </select>
                    </div>
                </SectionCard>

                <SectionCardExpandable title="Afhentninger">
                    <PickupChart data={statisticsApi.getPickupData(selectedTimeRange.getDate())}/>
                </SectionCardExpandable>

                <SectionCardExpandable title="Indsamlede poser Pr. virksomhed">
                    <BagsByPartnerChart data={statisticsApi.getBagsByPartner(selectedTimeRange.getDate())} />
                </SectionCardExpandable>

                <SectionCardExpandable title="Omkostninger">
                    <h2 className="text-section-header">Totale omkostninger for perioden: {mockExpenses.reduce((partialSum, expense) => partialSum + expense.amount, 0)}kr</h2>
                    <ExpensesChart data={statisticsApi.getExpenses(selectedTimeRange.getDate())}/>
                </SectionCardExpandable>
            </div>
        </PageContainer>
    );
}

export default AdminStatisticsPage;