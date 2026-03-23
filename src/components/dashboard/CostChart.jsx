import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function CostChart({ data, darkMode }) {
  const isMobile = window.innerWidth < 640;
  const axisColor = darkMode ? "#d1d5db" : "#374151";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";
  const bgColor = darkMode ? "#1f2937" : "#fff";

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
        <XAxis
          dataKey="city"
          tick={{ fill: axisColor, fontSize: isMobile ? 11 : 14 }}
          label={{
            value: "City",
            position: "insideBottom",
            style: { fill: axisColor, fontSize: 16, fontWeight: 600 },
            offset: -15
          }}
        />
        <YAxis
          tick={{ fill: axisColor, fontSize: isMobile ? 11 : 14 }}
          label={{
            value: "Total Cost (£)",
            angle: -90,
            position: "insideLeft",
            style: { fill: axisColor, fontSize: 16, fontWeight: 600 },
            dx: isMobile ? 0 : 5,
            dy: isMobile ? 30 : 50
          }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: bgColor, borderRadius: 8, border: 'none' }}
          labelStyle={{ color: axisColor }}
          itemStyle={{ color: axisColor }}
        />
        <Bar dataKey="totalCost" fill="#22c55e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}