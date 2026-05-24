import SectionCard from "../../../../../components/SectionCard.jsx";
import {ChevronDown, CircleDot, EyeIcon, PenIcon, ReceiptText, Trash, Trash2} from "lucide-react";
import Button from "../../../../../components/Button.jsx";

function ExpenditureCard({ expenditure, selected = false, onClick}) {

    return (
        <div>
            <div className='cursor-pointer select-none relative z-10' onClick={onClick}>
                <SectionCard backgroundColor="surface-secondary">
                    <div className="flex flex-col gap-gap-sm">
                        <div className="flex justify-between">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-gap-sm w-1/3 overflow-hidden">
                                    <h3 className="font-semibold ">{expenditure.name}</h3>
                                    <div className={`flex gap-gap-sm ${expenditure.is_pending ? 'text-danger' : 'text-success'}`}>
                                        <CircleDot />
                                        <p>{expenditure.is_pending
                                            ? 'Ubetalt'
                                            : 'Betalt'
                                        }</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-end -mb-3">
                                    <ChevronDown className={`transition-all duration-300 ${selected ? 'rotate-180' : ''}`}/>
                                </div>
                                <div className="flex flex-col gap-gap-sm items-end w-1/3">
                                    <h3 className='font-semibold text-text-color'>{expenditure.amount} kr</h3>
                                    <p className="text-muted">{expenditure.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>
            <div className={`relative z-0 -translate-y-3 w-full grid transition-[grid-template-rows] duration-200 ${selected ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden min-h-0 shadow-sm rounded-lg">
                    <SectionCard backgroundColor="surface-secondary">
                        <div className="flex justify-between md:max-w-44">
                            <button
                                type="button"
                                className="p-2 text-text-color cursor-pointer w-min"
                                aria-label="Slet partner"
                            >
                                <ReceiptText size={28} />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-text-color cursor-pointer w-min"
                                aria-label="Slet partner"
                            >
                                <PenIcon size={28} />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-danger cursor-pointer w-min"
                                aria-label="Slet partner"
                            >
                                <Trash2 size={28} />
                            </button>

                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

export default ExpenditureCard;