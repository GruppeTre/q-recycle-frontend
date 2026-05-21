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

    const [selectedTimeRange, setSelectedTimeRange] = useState(initSelectedTimeRange);

    //chart data state
    const [pickupData, setPickupData] = useState([]);
    const [pickupChartError, setPickupChartError] = useState(null);

    const [bagsByPartnerData, setBagsByPartnerData] = useState([]);
    const [bagsByPartnerChartError, setBagsByPartnerChartError] = useState(null);

    const openSections = JSON.parse(sessionStorage.getItem('openSections')) ?? [];

    useEffect(() => {

        //save selectedTimeRange to browser session storage
        sessionStorage.setItem('timeRange', selectedTimeRange.label);

        //get data for charts
        statisticsApi.getPickupData(selectedTimeRange.getDate())
            .then(result => {
                if (result.error) {
                    console.error(result.error);
                    setPickupChartError('Noget gik galt, prøv igen senere');
                } else {
                    setPickupData(result.data);
                    setPickupChartError(null);
                }
            });

        statisticsApi.getBagsByPartner(selectedTimeRange.getDate())
            .then(result => {
                if (result.error) {
                    console.error(result.error);
                    setBagsByPartnerChartError('Noget gik galt, prøv igen senere');
                } else {
                    setBagsByPartnerData(result.data);
                    setBagsByPartnerChartError(null);
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

    const handleSectionCardToggle = (isOpen, key) => {
        let updatedOpenSections = JSON.parse(sessionStorage.getItem('openSections')) ?? [];

        if (isOpen) {
            if (!updatedOpenSections.includes(key)) {
                updatedOpenSections.push(key);
            }
        } else {
            updatedOpenSections = updatedOpenSections.filter(openSection => openSection !== key);
        }

        sessionStorage.setItem('openSections', JSON.stringify(updatedOpenSections));
    }

    return (
        <PageContainer>
            <div className="flex flex-col gap-gap-md mt-gap-lg">

                <SectionCard title="Indstillinger">
                    <div className="flex gap-gap-lg">
                        <p>Select time range:</p>
                        <select
                            value={selectedTimeRange.label}
                            onChange={handleTimeRangeChange}
                        >
                            {Object.values(timeRange).map(tr =>
                                <option key={tr.label} value={tr.label}>{tr.label}</option>
                            )}
                        </select>
                    </div>
                </SectionCard>

                <SectionCardExpandable title="Afhentninger" initialIsOpen={openSections.includes('pickup')} onToggle={(newState) => handleSectionCardToggle(newState, 'pickup')}>
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

                <SectionCardExpandable title="Indsamlede poser Pr. virksomhed" initialIsOpen={openSections.includes('bags')} onToggle={(newState) => handleSectionCardToggle(newState, 'bags')}>
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

                <SectionCardExpandable title="Omkostninger" initialIsOpen={openSections.includes('expenses')} onToggle={(newState) => handleSectionCardToggle(newState, 'expenses')}>
                    <h2 className="text-section-header">Totale omkostninger for perioden: {mockExpenses.reduce((partialSum, expense) => partialSum + expense.amount, 0)}kr</h2>
                    <ExpensesChart data={statisticsApi.getExpenses(selectedTimeRange.getDate())}/>
                </SectionCardExpandable>
            </div>
        </PageContainer>
    );
}

function initSelectedTimeRange() {
    const sessionStorageTimeRange = Object.values(timeRange)
        .find(element => element.label === sessionStorage.getItem('timeRange'));

    if (sessionStorageTimeRange) {
        return sessionStorageTimeRange;
    } else {
        return timeRange.LAST_MONTH;
    }
}

export default AdminStatisticsPage;