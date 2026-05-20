import {useState, useEffect} from "react";
import Button from "../../components/Button.jsx";
import PickupRequestForm from "./components/PickupRequestForm.jsx";
import ConfirmationMessage from "./components/ConfirmationMessage.jsx";
import {supabaseClient} from "../../lib/supabaseClient";
import {useAuth} from "../../context/useAuth.js";
import PageContainer from "../../components/PageContainer.jsx";
import {pickupRequest} from "../../lib/pickupRequest.js";
import {pickupStatus} from "../../config/constants.js";
import Modal from "../../components/Modal.jsx";
import PickupRequestReceipt from "./components/PickupRequestReceipt.jsx";
import PickupRequestModal from "./components/PickupRequestModal.jsx";

function PartnerDashboardPage() {

    // =========================
    // State
    // =========================

    const [bags, setBags] = useState("")
    const [message, setMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeRequest, setActiveRequest] = useState(null)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    // =========================
    // Auth / derived values
    // =========================

    const {session} = useAuth();
    const user = session.user;
    const hasActiveRequest = activeRequest !== null

    // =========================
    // Modal helper functions
    // =========================

    function openCreateModal() {
        setBags("")
        setIsModalOpen(true)
    }

    function openEditModal() {
        setBags(String(activeRequest.bags))
        setIsModalOpen(true)
    }

    function closePickupModal() {
        setIsModalOpen(false)
        setBags("")
    }

    // =========================
    // Load active pickup request
    // =========================

    useEffect(() => {
        async function checkActiveRequest() {
            try {
                const data = await pickupRequest.getActive(user.id);

                if (!data || data.length === 0) {
                    setActiveRequest(null);
                    return;
                }

                if (data.length > 1) {
                    console.error("Fejl: Der findes flere aktive anmodninger");
                }

                setActiveRequest(data[0]);

            } catch (err) {
                console.log("Fejl ved hentning af aktive anmodninger", err);
                setActiveRequest(null);
            }
        }

        void checkActiveRequest()
    }, [user.id])

    // =========================
    // Submit new pickup request
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault()

        console.log("handleSubmit kaldt")

        console.log("user data:", JSON.stringify(user));

        const {data, error} = await supabaseClient
            .from("pickup")
            .insert({
            partner_id: user.id,
            bags: Number(bags),
            status: pickupStatus.REQUESTED,
            created_at: new Date(),
        })
            .select()

        console.log("error:", error)

        if (error) {
            setMessage("Noget gik galt, prøv igen")
            return
        }

        setMessage("Din anmodning er sendt")
        setActiveRequest(data[0])
        closePickupModal()
    };

    // =========================
    // Update existing pickup request
    // =========================

    const handleUpdate = async (event) => {
        event.preventDefault()
        try {

            const updatedBagCount = Number(bags)
            await pickupRequest.update(
                activeRequest.id,
                updatedBagCount
            )

            setMessage("Din anmodning er blevet opdateret")

            setActiveRequest({
                ...activeRequest,
                bags: updatedBagCount
            })

            closePickupModal()
        } catch{
            setMessage("Noget gik galt, prøv igen")
        }
    }

    // =========================
    // Cancel pickup request
    // =========================

    const handleCancel = async () => {
        try{
            await pickupRequest.cancelActive(user.id);

            setActiveRequest(null);
            setIsCancelModalOpen(false);
            setMessage("Din anmodning er blevet annulleret")
        }catch {
            setMessage("Noget gik galt, prøv igen")
        }
    }


    // =========================
    // Render
    // =========================

    return (
        <PageContainer>
            <div className="flex flex-col items-center mt-gap-xl gap-gap-md">

                <p>Her kan du anmode om at få hentet din pant</p>

                {!hasActiveRequest && (
                    <Button onClick={openCreateModal}>
                        Anmod om afhentning
                    </Button>
                )}

                {hasActiveRequest && (
                    <PickupRequestReceipt
                        activeRequest={activeRequest}

                        onUpdate={openEditModal}
                        onCancel={() => setIsCancelModalOpen(true)}
                    />
                )}


                {message && (
                    <ConfirmationMessage message={message}/>
                )}


                <PickupRequestModal
                    isOpen={isModalOpen}
                    hasActiveRequest={hasActiveRequest}
                    bags={bags}
                    setBags={setBags}
                    onClose={closePickupModal}
                    onSubmit={
                        hasActiveRequest
                            ? handleUpdate
                            : handleSubmit
                    }
                />


                {isCancelModalOpen && (
                    <Modal
                        title="Annuller afhentning"
                        onClose={() => setIsCancelModalOpen(false)}
                    >
                        <div className="flex flex-col gap-gap-md">

                            <p>
                                Er du sikker på, at du vil annullere afhentningen?
                            </p>

                            <Button onClick={handleCancel}>
                                Bekræft annullering
                            </Button>

                        </div>
                    </Modal>
                )}
            </div>

        </PageContainer>
    )
}

export default PartnerDashboardPage;