import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function DurationChart({ data }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to shorten labels for small screens
  const formatLabel = (label) => {
    if (screenWidth <= 375) {
      if (label === "Longest Call") return "Long Call";
      if (label === "Shortest Call") return "Short Call";
      if (label === "Average Duration") return "Avg Dur";
    }
    if (screenWidth <= 425) {
      if (label === "Average Duration") return "Avg Duration";
    }
    return label;
  };

  const getXAxisFontSize = () => {
    if (screenWidth <= 320) return 10;
    if (screenWidth <= 375) return 11;
    if (screenWidth <= 425) return 11;
    return 14;
  };

  const getXAxisAngle = () => {
    if (screenWidth <= 375) return -30; // rotate for very small screens
    return 0;
  };

  return (
    <div
      style={{
        width: "100%",
        height:
          screenWidth <= 320
            ? 200
            : screenWidth <= 375
            ? 220
            : screenWidth <= 425
            ? 240
            : screenWidth < 640
            ? 260
            : screenWidth < 768
            ? 300
            : screenWidth < 1024
            ? 360
            : 365
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fontSize: getXAxisFontSize() }}
            angle={getXAxisAngle()}
            textAnchor={screenWidth <= 375 ? "end" : "middle"}
            tickFormatter={formatLabel}
            label={{
              value: "Call Type",
              position: "insideBottom",
              offset: screenWidth <= 425 ? -25 : -15,
              style: { fontSize: 16, fontWeight: 600 }
            }}
          />
          <YAxis
            tick={{ fontSize: 14 }}
            label={{
              value: "Duration (s)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 16, fontWeight: 600 },
              dx: 7,
              dy: 50
            }}
          />
          <Tooltip />
          <Bar dataKey="duration" fill="#6366f1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}