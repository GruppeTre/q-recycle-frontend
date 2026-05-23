import PageContainer from "../../../components/PageContainer.jsx";
import SectionCard from "../../../components/SectionCard.jsx";
import {Link} from "react-router";
import Button from "../../../components/Button.jsx";
import {CirclePlus} from "lucide-react";
import {useExpenditureData} from "../hooks/useExpenditureData.js";

function DriverExpendituresPage() {

const { data: expenditureData, error, isLoading } = useExpenditureData()

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard headerContent={
                    <div className="flex justify-between items-center">
                        <h2 className="text-section-header">Dine udgifter</h2>
                        <Link to="new">
                            <Button icon={<CirclePlus />}>Ny udgift</Button>
                        </Link>
                    </div>
                }>
                    {expenditureData && expenditureData.length <= 0 && (
                        <p className="text-sm text-gray-500">
                            Du har ingen nuværende udgifter.
                        </p>
                    )}

                    {(expenditureData && expenditureData.length >= 1) &&
                        <div>
                            <p>Udgiftsliste</p>
                        </div>
                    }



                </SectionCard>

            </div>
        </PageContainer>
    );
}

export default DriverExpendituresPage;