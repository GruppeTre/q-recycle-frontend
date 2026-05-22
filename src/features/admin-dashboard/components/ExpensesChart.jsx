import {Area, AreaChart, Tooltip, XAxis, YAxis} from "recharts";

function valueToCurrency(value) {
    return value + 'kr';
}

function ExpensesChart({data}) {
    return (
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
                     backgroundColor: 'var(--color-surface)'
                 }}
             />
            <Area type="monotone" dataKey="unpaid" stackId="1" stroke="#8884d8" fill="#ffc658" />
            <Area type="monotone" dataKey="paid" stackId="1" stroke="#82ca9d" fill="#82ca9d" />

        </AreaChart>
    );
}

export default ExpensesChart;