import SectionCard from "../../../../../components/SectionCard.jsx";

function ExpenditureCard({ expenditure }) {
    return (
        <SectionCard backgroundColor="surface-secondary">
            <p>{expenditure.created_at}</p>
        </SectionCard>
    );
}

export default ExpenditureCard;