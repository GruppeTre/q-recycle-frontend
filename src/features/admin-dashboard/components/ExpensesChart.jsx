import {Area, AreaChart, Tooltip, XAxis, YAxis} from "recharts";
import SectionCard from "../../../components/SectionCard.jsx";

function valueToCurrency(value) {
    return value + 'kr';
}

function ExpensesChart({data}) {
    return (
        <SectionCard backgroundColor="surface-secondary">
            <AreaChart
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
                <YAxis
                    width="auto"
                    stroke="var(--color-text-color)"
                    tickFormatter={valueToCurrency}
                />
                <Tooltip
                    cursor={{
                        stroke: 'var(--color-primary-hover)',
                    }}
                    contentStyle={{
                        color: 'var(--color-text)',
                        backgroundColor: 'var(--color-surface-primary)'
                    }}
                />
                <Area type="monotone" dataKey="unpaid" stackId="1" stroke="var(--color-danger)" fill="var(--color-danger)" />
                <Area type="monotone" dataKey="paid" stackId="1" stroke="var(--color-success)" fill="var(--color-success)" />

            </AreaChart>
        </SectionCard>
    );
}

export default ExpensesChart;