import PageContainer from "../../../../components/PageContainer.jsx";
import SectionCard from "../../../../components/SectionCard.jsx";
import {Link} from "react-router";
import Button from "../../../../components/Button.jsx";
import {CirclePlus} from "lucide-react";
import {useExpenditureData} from "./hooks/useExpenditureData.js";
import ExpenditureCard from "./components/ExpenditureCard.jsx";
import Spinner from "../../../../components/Spinner.jsx";
import {useState} from "react";
import {expenditure} from "../../../../lib/expenditure.js";

function DriverExpendituresPage() {

    const { data: expenditureData, error, isLoading } = useExpenditureData();
    const [selectedExpenditure, setSelectedExpenditure] = useState(null);

    const handleExpenditureClick = (expenditureId) => {
        console.log(expenditureId)

        const selected = expenditureData.find(expenditure => expenditure.id === expenditureId);

        if (selectedExpenditure?.id === expenditureId) {
            console.log('duplicate detected!');
            setSelectedExpenditure(null);
            return;
        }

        setSelectedExpenditure(selected);
    }

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard headerContent={
                    <div className="flex flex-col gap-gap-sm">
                        <div className="flex justify-between items-center">
                            <h2 className="text-section-header">Dine udgifter</h2>
                            <Link to="new">
                                <Button icon={<CirclePlus />}>Ny udgift</Button>
                            </Link>
                        </div>
                    </div>
                }>
                    {isLoading &&
                        <div className="w-full flex justify-center">
                            <Spinner />
                        </div>
                    }
                    {expenditureData && expenditureData.length <= 0 && (
                        <p className="text-sm text-text-color-muted">
                            Du har ingen nuværende udgifter.
                        </p>
                    )}

                    {(expenditureData && expenditureData.length >= 1) &&
                        <div className="flex flex-col gap-gap-sm">
                            {expenditureData.map(expenditure =>
                                <ExpenditureCard
                                    selected={selectedExpenditure !== null && selectedExpenditure.id === expenditure.id}
                                    key={expenditure.id}
                                    expenditure={expenditure}
                                    onClick={() => handleExpenditureClick(expenditure.id)}
                                />)
                            }
                        </div>
                    }



                </SectionCard>

            </div>
        </PageContainer>
    );
}

export default DriverExpendituresPage;