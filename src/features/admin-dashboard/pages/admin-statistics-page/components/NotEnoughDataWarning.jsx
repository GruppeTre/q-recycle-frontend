import SectionCard from "../../../../../components/SectionCard.jsx";

function NotEnoughDataWarning({children}) {
    return (
        <SectionCard title="Utilstrækkelig data" backgroundColor="surface-secondary">
            {children ?
                children :
                <p className="text-body">Der er ikke nok data til at tegne denne graf</p>
            }
        </SectionCard>
    );
}

export default NotEnoughDataWarning;