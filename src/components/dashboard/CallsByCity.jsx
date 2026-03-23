import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f97316", "#ef4444", "#14b8a6", "#8b5cf6"];

export default function CallsByCity({ data = [], darkMode }) {
  if (!data.length) return <p className="text-center">Loading...</p>;

  const totalCalls = data.reduce((sum, item) => sum + item.calls, 0);

  return (
    <div className="flex justify-center items-center w-full relative h-[270px] sm:h-[320px] md:h-[350px] lg:h-[370px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="calls"
            nameKey="city"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={6}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={darkMode ? "#111827" : "#fff"} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value} calls`, props.payload.city]}
            contentStyle={{ borderRadius: 8, border: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalCalls}</div>
        <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Calls</div>
      </div>
    </div>
  );
}