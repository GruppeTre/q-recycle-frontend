import PageContainer from "../../../../components/PageContainer.jsx";
import SectionCard from "../../../../components/SectionCard.jsx";
import Button from "../../../../components/Button.jsx";
import {CirclePlus, Trash, XIcon} from "lucide-react";
import {useExpenditureData} from "./hooks/useExpenditureData.js";
import ExpenditureCard from "./components/ExpenditureCard.jsx";
import Spinner from "../../../../components/Spinner.jsx";
import {useState} from "react";
import Modal from "../../../../components/Modal.jsx";
import ExpenditureForm from "./components/ExpenditureForm.jsx";
import {useAuth} from "../../../../context/useAuth.js";

function DriverExpendituresPage() {

    const {
        data: expenditureData,
        error: expenditureDataError,
        isLoading,
        deleteExpenditure,
        addExpenditure,
        updateExpenditure,
    } = useExpenditureData();

    const { session } = useAuth();
    const [selectedExpenditure, setSelectedExpenditure] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);

    const handleExpenditureClick = (expenditureId) => {
        const selected = expenditureData.find(expenditure => expenditure.id === expenditureId);

        console.log('selected id: ', expenditureId);

        if (selectedExpenditure?.id === expenditureId) {
            setSelectedExpenditure(null);
            return;
        }
        setSelectedExpenditure(selected);
    }

    const handleCreateModalToggle = () => {
        setShowCreateModal(prevState => !prevState);
    }

    const handleEditModalToggle = () => {
        setShowEditModal(prevState => !prevState);
    }

    const handleDeleteModalToggle = () => {
        setShowDeleteModal(prevState => !prevState);
    }

    const handleDelete = async () => {
        await deleteExpenditure(selectedExpenditure.id);
        setSelectedExpenditure(null);
        setShowDeleteModal(false);
    }

    const handleCreate = async (formData) => {
        const newExpenditure = {
            user_id: session.user.id,
            amount: parseFloat(formData.get('price')),
            is_pending: true,
            created_at: new Date(formData.get('date')).toISOString(),
            name: formData.get('name')
        }

        try {
            await addExpenditure(newExpenditure);
        } catch (e) {
            console.error(e);
            setError('Noget gik galt, prøv igen senere');
        } finally {
            setShowCreateModal(false);
        }
    }

    const handleUpdate = async (formData) => {
        console.log('Updating expense with name: ', formData.get('name'));

        const newExpenditure = {
            id: selectedExpenditure.id,
            user_id: session.user.id,
            amount: parseFloat(formData.get('price')),
            is_pending: selectedExpenditure.is_pending,
            created_at: new Date(formData.get('date')).toISOString(),
            name: formData.get('name')
        }

        try {
            await updateExpenditure(newExpenditure);
        } catch (e) {
            console.error(e);
            setError('Noget gik galt, prøv igen senere');
        } finally {
            setSelectedExpenditure(null);
            setShowEditModal(false);
        }
    }

    return (
        <PageContainer>
            {showCreateModal &&
                <div className="relative z-30">
                    <Modal showCancelBtn={false}>
                        <div>
                            <h2 className="text-section-header">Opret udgift</h2>
                            <ExpenditureForm onCancel={handleCreateModalToggle} onSubmit={handleCreate}/>
                        </div>
                    </Modal>
                </div>
            }
            {showEditModal &&
                <div className="relative z-30">
                    <Modal showCancelBtn={false}>
                        <div>
                            <h2 className="text-section-header">Opdater udgift</h2>
                            <ExpenditureForm onCancel={handleEditModalToggle} onSubmit={handleUpdate} toUpdate={selectedExpenditure}/>
                        </div>
                    </Modal>
                </div>
            }
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
                            <Button icon={<CirclePlus />} onClick={handleCreateModalToggle}>Ny udgift</Button>
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
                                    onEdit={handleEditModalToggle}
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