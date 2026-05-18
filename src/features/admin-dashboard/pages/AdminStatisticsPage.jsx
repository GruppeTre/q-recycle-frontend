import PageContainer from "../../../components/PageContainer.jsx";
import SectionCard from "../../../components/SectionCard.jsx";

function AdminStatisticsPage() {
    return (
        <PageContainer>
            <div className="flex flex-col gap-gap-md mt-gap-lg">

                <SectionCard title="Afhentninger">
                </SectionCard>

                <SectionCard title="Indsamlede poser">
                </SectionCard>

                <SectionCard title="Udgifter">
                </SectionCard>

                <SectionCard title="Chaufføraktivitet">
                </SectionCard>
            </div>
        </PageContainer>
    );
}

export default AdminStatisticsPage;