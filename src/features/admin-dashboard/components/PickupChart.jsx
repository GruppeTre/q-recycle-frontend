import {Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import SectionCard from "../../../components/SectionCard.jsx";

function PickupChart({data}) {
    return (
        <SectionCard backgroundColor="surface-secondary">
            <LineChart
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: 1.618,
                }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <XAxis
                    dataKey="name"
                    stroke="var(--color-text-color)"
                    padding={{ left: 15, right: 15 }}
                />
                <YAxis width="auto" stroke="var(--color-text-color)"/>
                <Tooltip
                    cursor={{
                        stroke: 'var(--color-primary-hover)',
                    }}
                    contentStyle={{
                        color: 'var(--color-text)',
                        backgroundColor: 'var(--color-surface-primary)'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="pickups"
                    name="Afhentede poser"
                    stroke="var(--color-primary)"
                />
            </LineChart>
        </SectionCard>
    );
}

export default PickupChart;