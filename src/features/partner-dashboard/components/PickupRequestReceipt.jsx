import Button from "../../../components/Button.jsx";
import {pickupStatus} from "../../../config/constants.js";


function PickupRequestReceipt({activeRequest, onUpdate, onCancel}) {

    const statusText={
        [pickupStatus.REQUESTED]: "Afventer afhentning",
        [pickupStatus.SCHEDULED]: "Afhentning planlagt",
        [pickupStatus.COMPLETED]: "Afhentet",
        [pickupStatus.CANCELLED]: "Annulleret",
    }

    return (
        <div className="bg-surface border border-primary rounded-md p-4 mt-gap-md">
            <h2 className="text-section-header">
                Din aktuelle anmodning
            </h2>

            <p className="text-body">
                Antal poser: {activeRequest.bags}
            </p>

            <p className="text-muted">
                Status: {statusText[activeRequest.status]}
            </p>

            <div className="flex gap-gap-md mt-gap-md">
                <Button onClick={onUpdate}>
                    Rediger antal poser
                </Button>

                <Button onClick={onCancel}>
                    Annuller anmodning
                </Button>
            </div>
        </div>
    )
}

export default PickupRequestReceipt;