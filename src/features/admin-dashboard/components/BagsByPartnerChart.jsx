import {Bar, BarChart, Tooltip, XAxis, YAxis} from "recharts";
import SectionCard from "../../../components/SectionCard.jsx";

function BagsByPartnerChart({data}) {
    return (
        <SectionCard backgroundColor="surface-secondary">
            <BarChart
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: 1.618
                }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 40,
                }}
            >
                <XAxis
                    dataKey="name"
                    angle={-25}
                    tickMargin={30}
                    fontSize={'0.6rem'}
                />

                <YAxis width="auto"/>
                <Tooltip />
                <Bar
                    dataKey="amount"
                    fill="var(--color-primary)"
                    radius={[5, 5, 0, 0]}
                />
            </BarChart>
        </SectionCard>
    );
}

export default BagsByPartnerChart;