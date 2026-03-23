import { FiPhone, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaPoundSign } from "react-icons/fa";

export default function KPICards({ kpis }) {
  const cards = [
    { label: "Total Calls", value: kpis.totalCalls, icon: <FiPhone />, color: "from-indigo-500 to-indigo-700" },
    { label: "Total Cost", value: `£${kpis.totalCost}`, icon: <FaPoundSign />, color: "from-green-500 to-green-700" },
    { label: "Avg Duration", value: `${kpis.avgDuration}s`, icon: <FiClock />, color: "from-yellow-400 to-yellow-600" },
    { label: "Successful", value: kpis.successfulCalls, icon: <FiCheckCircle />, color: "from-teal-400 to-teal-600" },
    { label: "Failed", value: kpis.failedCalls, icon: <FiXCircle />, color: "from-red-500 to-red-700" },
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto p-6">
      {/* Background blobs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600 rounded-full blur-[150px] top-[-120px] left-[-100px] opacity-30 animate-pulse-slow"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-500 rounded-full blur-[150px] bottom-[-100px] right-[-80px] opacity-30 animate-pulse-slow"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 p-6 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)]
              transition-transform duration-300 hover:scale-105
              text-white
              bg-gradient-to-br ${card.color}
              backdrop-blur-2xl`}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full text-xl sm:text-2xl bg-white/20">
              {card.icon}
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm opacity-90 truncate">{card.label}</span>
              <span className="text-lg sm:text-xl md:text-2xl font-bold">{card.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}