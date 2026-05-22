import Modal from "../../../components/Modal.jsx"
import PickupRequestForm from "./PickupRequestForm.jsx";

function PickupRequestModal({isOpen, hasActiveRequest, bags, setBags, onClose, onSubmit}) {

    if (!isOpen) {
        return null
    }

    return (
        <Modal
            title={
                hasActiveRequest
                    ? "Rediger antal poser"
                    : "Antal poser"
            }
            onClose={onClose}
        >

            <PickupRequestForm
                bags={bags}
                setBags={setBags}
                onSubmit={onSubmit}
                buttonText={
                    hasActiveRequest
                        ? "Gem ændringer"
                        : "Bekræft"
                }
                isUpdated={hasActiveRequest}
            />
        </Modal>
    )
}

export default PickupRequestModal;