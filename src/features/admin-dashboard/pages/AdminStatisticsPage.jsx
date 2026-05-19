import PageContainer from "../../../components/PageContainer.jsx";
import SectionCardExpandable from "../../../components/SectionCardExpandable.jsx";
import Button from "../../../components/Button.jsx";

function AdminStatisticsPage() {



    return (
        <PageContainer>
            <div className="flex flex-col gap-gap-md mt-gap-lg">

                <SectionCardExpandable title="Afhentninger">
                    <h1>testetsetest</h1>
                    <Button>TEST buttons</Button>
                </SectionCardExpandable>

                <SectionCardExpandable
                    title="Indsamlede poser">
                </SectionCardExpandable>

                <SectionCardExpandable title="Udgifter">
                </SectionCardExpandable>

                <SectionCardExpandable title="Chaufføraktivitet">
                </SectionCardExpandable>
            </div>
        </PageContainer>
    );
}

export default AdminStatisticsPage;