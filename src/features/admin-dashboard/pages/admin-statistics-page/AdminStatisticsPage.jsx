import PageContainer from "../../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../../components/SectionCardExpandable.jsx";
import PickupChart from "../../components/PickupChart.jsx";
import {statisticsApi} from "./lib/statisticsApi.js";
import BagsByPartnerChart from "../../components/BagsByPartnerChart.jsx";
import {useEffect, useState} from "react";
import {timeRange} from "./config/timeRange.js";
import SectionCard from "../../../../components/SectionCard.jsx";
import NotEnoughDataWarning from "./components/NotEnoughDataWarning.jsx";
import {useChartData} from "./hooks/useChartData.js";
import Spinner from "../../../../components/Spinner.jsx";
import ExpensesChart from "../../components/ExpensesChart.jsx";

function AdminStatisticsPage() {

    const [selectedTimeRange, setSelectedTimeRange] = useState(initSelectedTimeRange);

    const {
        data: pickupData,
        error: pickupChartError,
        isLoading: pickupChartIsLoading
    } = useChartData(statisticsApi.getPickupData, selectedTimeRange);

    const {
        data: bagsByPartnerData,
        error: bagsByPartnerChartError,
        isLoading: bagsByPartnerChartIsLoading
    } = useChartData(statisticsApi.getBagsByPartner, selectedTimeRange);

    const {
        data: expenditureData,
        error: expenditureChartError,
        isLoading: expenditureChartIsLoading
    } = useChartData(statisticsApi.getExpenses, selectedTimeRange)

    const openSections = JSON.parse(sessionStorage.getItem('openSections')) ?? [];

    useEffect(() => {

        //save selectedTimeRange to browser session storage
        sessionStorage.setItem('timeRange', selectedTimeRange.label);

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
                    {pickupChartIsLoading
                        ? <div className="flex justify-center">
                            <Spinner />
                        </div>
                        : pickupChartError
                            ? <div>{pickupChartError}</div>
                            : pickupData.length >= 2
                                ? <PickupChart data={pickupData}/>
                                : <NotEnoughDataWarning>
                                    <p className="text-body">
                                        Der skal være minimum 2 datapunkter for at tegne denne graf
                                    </p>
                                </NotEnoughDataWarning>
                    }
                </SectionCardExpandable>

                <SectionCardExpandable title="Indsamlede poser Pr. virksomhed" initialIsOpen={openSections.includes('bags')} onToggle={(newState) => handleSectionCardToggle(newState, 'bags')}>
                    {bagsByPartnerChartIsLoading
                        ? <div className="flex justify-center">
                            <Spinner />
                        </div>
                        : bagsByPartnerChartError
                            ? <div>{bagsByPartnerChartError}</div>
                            : bagsByPartnerData.length >= 1
                                ? <BagsByPartnerChart data={bagsByPartnerData}/>
                                : <NotEnoughDataWarning>
                                    <p className="text-body">
                                        Der skal være minimum ét datapunkter for at tegne denne graf
                                    </p>
                                </NotEnoughDataWarning>
                    }
                </SectionCardExpandable>

                <SectionCardExpandable title="Samlede udgifter" initialIsOpen={openSections.includes('expenditures')} onToggle={(newState) => handleSectionCardToggle(newState, 'expenditures')}>
                    {expenditureChartIsLoading
                        ? <div className="flex justify-center">
                            <Spinner />
                        </div>
                        : expenditureChartError
                            ? <div>{bagsByPartnerChartError}</div>
                            : expenditureData.length >= 2
                                ? <ExpensesChart data={expenditureData}/>
                                : <NotEnoughDataWarning>
                                    <p className="text-body">
                                        Der skal være minimum ét datapunkter for at tegne denne graf
                                    </p>
                                </NotEnoughDataWarning>
                    }
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