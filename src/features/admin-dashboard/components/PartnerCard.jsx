import { Pencil, Trash2 } from "lucide-react";

function PartnerCard({ partner, onEdit, onDelete }) {
    const addressLine = partner.address
        ? `${partner.address.street} ${partner.address.number ?? ""}, ${partner.address.zipcode} ${partner.address.city}`
        : "Ingen adresse";

    return (
        <div className="flex items-center justify-between p-gap-md bg-surface rounded-md">
            <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">{partner.name ?? "Uden navn"}</h3>
                <p className="text-sm bg-surface">{addressLine}</p>
                {partner.phone_number && (
                    <p className="text-sm bg-surface">{partner.phone_number}</p>
                )}
            </div>

            <div className="flex gap-2 items-center">
                <button
                    type="button"
                    onClick={() => onEdit?.(partner)}
                    className="p-2 accent-success hover:bg-green-50 rounded-md cursor-pointer"
                    aria-label="Rediger partner"
                >
                    <Pencil size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => onDelete?.(partner)}
                    className="p-2 accent-danger hover:bg-red-50 rounded-md cursor-pointer"
                    aria-label="Slet partner"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default PartnerCard;