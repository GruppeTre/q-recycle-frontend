import {useState} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

function SectionCardExpandable({children, title = null, initialIsOpen, backgroundColor = null}) {

    const [isOpen, setIsOpen] = useState(initialIsOpen);

    const handleAccordionToggle = () => {
        setIsOpen(prevState => !prevState);
    }

    return (
        <div className={`flex flex-col gap-gap-md rounded-lg px-gap-md py-gap-md shadow-sm ${backgroundColor ? `bg-${backgroundColor}` : 'bg-background'}`}>
            {title &&
                <button className="cursor-pointer" onClick={handleAccordionToggle}>
                    <div className={`flex justify-between w-full ${isOpen ? 'border-b' : ''} border-surface`}>
                        <h2 className="text-section-header">{title}</h2>
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </div>
                </button>
            }
            {isOpen && children}
        </div>
    );
}

export default SectionCardExpandable;