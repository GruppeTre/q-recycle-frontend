import PageContainer from "../../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../../components/SectionCardExpandable.jsx";
import PickupChart from "../../components/PickupChart.jsx";
import {mockExpenses, statisticsApi} from "./lib/statisticsApi.js";
import BagsByPartnerChart from "../../components/BagsByPartnerChart.jsx";
import ExpensesChart from "../../components/ExpensesChart.jsx";
import {useEffect, useState} from "react";
import {timeRange} from "./config/timeRange.js";
import SectionCard from "../../../../components/SectionCard.jsx";
import NotEnoughDataWarning from "./components/NotEnoughDataWarning.jsx";

function AdminStatisticsPage() {

    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange.LAST_MONTH);

    //chart data state
    const [pickupData, setPickupData] = useState([]);
    const [pickupChartError, setPickupChartError] = useState(null);

    const [bagsByPartnerData, setBagsByPartnerData] = useState([]);
    const [bagsByPartnerChartError, setBagsByPartnerChartError] = useState(null);

    useEffect(() => {

        statisticsApi.getPickupData(selectedTimeRange.getDate())
            .then(result => {
                if (result.error) {
                    console.error(result.error);
                    setPickupChartError('Noget gik galt, prøv igen senere');
                } else {
                    setPickupData(result.data);
                }
            });

        statisticsApi.getBagsByPartner(selectedTimeRange.getDate())
            .then(result => {
                if (result.error) {
                    console.error(result.error);
                    setBagsByPartnerChartError('Noget gik galt, prøv igen senere');
                } else {
                    setBagsByPartnerData(result.data);
                }
            });

    }, [selectedTimeRange]);

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
                    {pickupChartError &&
                        <div>{pickupChartError}</div>
                    }
                    {(pickupData.length >= 2 && !pickupChartError) ?
                        <PickupChart data={pickupData}/>
                        :
                        <NotEnoughDataWarning>
                            <p className="text-body">Der skal være minimum 2 datapunkter for at tegne denne graf</p>
                        </NotEnoughDataWarning>
                    }
                </SectionCardExpandable>

                <SectionCardExpandable title="Indsamlede poser Pr. virksomhed">
                    {bagsByPartnerChartError &&
                        <div>{bagsByPartnerChartError}</div>
                    }
                    {(bagsByPartnerData.length >= 1) && !bagsByPartnerChartError ?
                        <BagsByPartnerChart data={bagsByPartnerData} />
                        :
                        <NotEnoughDataWarning>
                            <p className="text-body">Der skal være minimum ét datapunkt for at tegne denne graf</p>
                        </NotEnoughDataWarning>
                    }
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