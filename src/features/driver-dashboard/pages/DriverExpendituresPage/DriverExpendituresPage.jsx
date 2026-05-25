import PageContainer from "../../../../components/PageContainer.jsx";
import SectionCard from "../../../../components/SectionCard.jsx";
import {Link} from "react-router";
import Button from "../../../../components/Button.jsx";
import {CirclePlus, Trash, XIcon} from "lucide-react";
import {useExpenditureData} from "./hooks/useExpenditureData.js";
import ExpenditureCard from "./components/ExpenditureCard.jsx";
import Spinner from "../../../../components/Spinner.jsx";
import {useState} from "react";
import Modal from "../../../../components/Modal.jsx";

function DriverExpendituresPage() {

    const { data: expenditureData, error, isLoading, deleteExpenditure } = useExpenditureData();
    const [selectedExpenditure, setSelectedExpenditure] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleExpenditureClick = (expenditureId) => {
        console.log(expenditureId)

        const selected = expenditureData.find(expenditure => expenditure.id === expenditureId);

        if (selectedExpenditure?.id === expenditureId) {
            setSelectedExpenditure(null);
            return;
        }

        setSelectedExpenditure(selected);
    }

    const handleDeleteModalToggle = () => {
        setShowDeleteModal(prevState => !prevState);
    }

    const handleDelete = async () => {
        console.log('deleting item with name: ', selectedExpenditure.name);
        await deleteExpenditure(selectedExpenditure.id);
        setSelectedExpenditure(null);
        setShowDeleteModal(false);
    }

    return (
        <PageContainer>
            {showDeleteModal &&
                <div className="relative z-30">
                    <Modal onClose={handleDeleteModalToggle} showCancelBtn={false}>
                        <div>
                            <h2 className="text-section-header">Vil du slette denne udgift?</h2>
                            <p className="text-muted">Denne handling kan ikke fortrydes</p>
                        </div>
                        <div className="flex justify-between mt-gap-lg">
                            <Button backgroundColor="primary" icon={<XIcon />} onClick={handleDeleteModalToggle}>
                                <p>Annuller</p>
                            </Button>
                            <Button backgroundColor="danger" icon={<Trash />} hoverColor="danger-hover" onClick={handleDelete}>
                                <p>Bekræft</p>
                            </Button>
                        </div>
                    </Modal>
                </div>
            }
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
                                    onDelete={handleDeleteModalToggle}
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