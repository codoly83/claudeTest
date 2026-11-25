import { useId } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import type { ChipColor } from '../../types';
import { classNames } from '../../utils/classNames';

// 차트 (docs/components/Chart.md) — recharts
// 색은 디자인 토큰 이름(green·blue…)으로만 받아 CSS 변수로 그립니다. 높이는 size 프리셋 클래스.
// 보조기술용으로 제목과 같은 데이터를 숨김 표(srOnly)로 함께 제공합니다.
interface ChartSeries {
    dataKey: string;
    name: string;
    color: ChipColor;
}

interface ChartProps<T extends Record<string, string | number>> {
    type: 'line' | 'area' | 'bar' | 'pie' | 'radar';
    data: T[];
    xKey: keyof T & string;
    series: ChartSeries[];
    title: string;
    size?: 'sm' | 'md' | 'lg';
    hasLegend?: boolean;
}

const COLOR_VAR: Record<ChipColor, string> = {
    green: 'var(--color-primary)',
    blue: 'var(--color-blue)',
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    purple: 'var(--color-purple)',
    gray: 'var(--color-text-muted)'
};

const PIE_COLORS: ChipColor[] = ['green', 'blue', 'yellow', 'purple', 'red', 'gray'];

const Chart = <T extends Record<string, string | number>>({ type, data, xKey, series, title, size = 'md', hasLegend = true }: ChartProps<T>) => {
    const titleId = useId();
    const legend = hasLegend ? <Legend /> : null;
    const axes = (
        <>
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
            <XAxis dataKey={String(xKey)} />
            <YAxis />
            <Tooltip />
        </>
    );

    const renderChart = () => {
        if (type === 'line') {
            return (
                <LineChart data={data}>
                    {axes}
                    {legend}
                    {series.map((item) => (
                        <Line key={item.dataKey} type="monotone" dataKey={item.dataKey} name={item.name} stroke={COLOR_VAR[item.color]} strokeWidth={2} />
                    ))}
                </LineChart>
            );
        }
        if (type === 'area') {
            return (
                <AreaChart data={data}>
                    {axes}
                    {legend}
                    {series.map((item) => (
                        <Area key={item.dataKey} type="monotone" dataKey={item.dataKey} name={item.name} stroke={COLOR_VAR[item.color]} fill={COLOR_VAR[item.color]} fillOpacity={0.2} />
                    ))}
                </AreaChart>
            );
        }
        if (type === 'bar') {
            return (
                <BarChart data={data}>
                    {axes}
                    {legend}
                    {series.map((item) => (
                        <Bar key={item.dataKey} dataKey={item.dataKey} name={item.name} fill={COLOR_VAR[item.color]} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            );
        }
        if (type === 'pie') {
            const first = series[0];
            return (
                <PieChart>
                    <Tooltip />
                    {legend}
                    <Pie data={data} dataKey={first?.dataKey ?? ''} nameKey={xKey} innerRadius="45%" outerRadius="80%" paddingAngle={2}>
                        {data.map((entry, index) => (
                            <Cell key={String(entry[xKey])} fill={COLOR_VAR[PIE_COLORS[index % PIE_COLORS.length]]} />
                        ))}
                    </Pie>
                </PieChart>
            );
        }
        return (
            <RadarChart data={data} outerRadius="75%">
                <PolarGrid className="chartGrid" />
                <PolarAngleAxis dataKey={String(xKey)} />
                <PolarRadiusAxis />
                <Tooltip />
                {legend}
                {series.map((item) => (
                    <Radar key={item.dataKey} dataKey={item.dataKey} name={item.name} stroke={COLOR_VAR[item.color]} fill={COLOR_VAR[item.color]} fillOpacity={0.25} />
                ))}
            </RadarChart>
        );
    };

    return (
        <figure className={classNames('chart', size)} aria-labelledby={titleId}>
            <figcaption id={titleId} className="srOnly">
                {title}
            </figcaption>
            <div className="chartCanvas" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
            {/* 차트 대체 데이터 (보조기술용) */}
            <table className="srOnly">
                <caption>{title}</caption>
                <thead>
                    <tr>
                        <th scope="col">{xKey}</th>
                        {series.map((item) => (
                            <th key={item.dataKey} scope="col">
                                {item.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={String(row[xKey])}>
                            <th scope="row">{row[xKey]}</th>
                            {series.map((item) => (
                                <td key={item.dataKey}>{row[item.dataKey]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
};

export default Chart;
