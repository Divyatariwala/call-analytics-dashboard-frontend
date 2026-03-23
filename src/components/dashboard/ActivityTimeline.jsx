import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ActivityTimeline({ data = [], type = "hour" }) {
  if (!data.length) return <p className="text-center">Loading...</p>;

  const xKey = type === "day" ? "day" : "hour";
  const axisColor = "#374151"; // dark gray for axes
  const gridColor = "#e5e7eb"; // light gray for grid
  const tooltipBg = "#fff"; // white tooltip

  return (
    <div className="w-full h-[250px] sm:h-[320px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey={xKey}
            label={{
              value: type === "day" ? "Day" : "Hour",
              position: "insideBottom",
              style: { fontSize: 16, fontWeight: 600, fill: axisColor },
              offset: -15
            }}
            tick={{ fill: axisColor, fontSize: 14 }}
          />
          <YAxis
            label={{
              value: "Number of Calls",
              angle: -90,
              position: "insideLeft",
              dx: 10,
              dy: 50,
              style: { fontSize: 16, fontWeight: 600, fill: axisColor }
            }}
            tick={{ fill: axisColor, fontSize: 14 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, borderRadius: 8, border: 'none' }}
            labelStyle={{ color: axisColor }}
            itemStyle={{ color: axisColor }}
          />
          <Line type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}