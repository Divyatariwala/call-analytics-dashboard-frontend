import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICards from "@/components/dashboard/KPICards";
import DurationChart from "@/components/dashboard/DurationChart";
import CostChart from "@/components/dashboard/CostChart";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import CallsByCity from "@/components/dashboard/CallsByCity";
import RecentCallsTable from "@/components/dashboard/RecentCallsTable";
import { fetchCalls } from "@/services/api";
import {
  calculateKPIs,
  getCallsPerHour,
  getCallsPerDay,
  getCallDurationStats,
  getCostByCity,
  getCallsByCity
} from "@/utils/analytics";

export default function DashboardPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [timelineType, setTimelineType] = useState("hour");

  const role = localStorage.getItem("role");

  // Fetch calls
  useEffect(() => {
    setLoading(true);
    fetchCalls()
      .then(res => {
        const callArray = Array.isArray(res) ? res : res?.data || [];
        setCalls(callArray);
      })
      .catch(() => setCalls([]))
      .finally(() => setLoading(false));
  }, []);

  // Filtered calls based on city and search input
  const filteredCalls = useMemo(() => {
    return calls
      .filter(c => selectedCity === "all" ? true : c.city === selectedCity)
      .filter(c => {
        if (!searchInput) return true;
        return (
          c.city?.toLowerCase().includes(searchInput.toLowerCase()) ||
          c.callerName?.toLowerCase().includes(searchInput.toLowerCase()) ||
          c.callerNumber?.includes(searchInput) ||
          c.receiverNumber?.includes(searchInput)
        );
      });
  }, [calls, selectedCity, searchInput]);

  // Analytics
  const kpis = calculateKPIs(filteredCalls);
  const durationStats = getCallDurationStats(filteredCalls);
  const costData = getCostByCity(filteredCalls);
  const cityData = getCallsByCity(filteredCalls);
  const timelineData = timelineType === "hour" ? getCallsPerHour(filteredCalls) : getCallsPerDay(filteredCalls);
  const cities = [...new Set(calls.map(c => c.city).filter(Boolean))];

  return (
    <DashboardLayout className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
      
      {/* Filters */}
      <section className="flex flex-wrap gap-4 mb-4 w-full">
        <input
          type="text"
          placeholder="Search city or phone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-auto border rounded px-3 py-2 
                     bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-colors duration-500"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full sm:w-auto border rounded px-4 py-2 
                     bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-colors duration-500"
        >
          <option value="all">All Cities</option>
          {cities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </section>

      {/* KPI Cards */}
      <KPICards kpis={kpis} />

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 w-full overflow-hidden">
        <div className="p-4 sm:p-6 rounded-xl shadow-lg 
                        bg-gray-50 dark:bg-gray-800 
                        dark:shadow-gray-900/30 
                        transition-colors duration-500">
          <div className="lg:h-[345px] md:h-[345px] sm:h-[320px] w-full overflow-hidden">
            <DurationChart data={durationStats} />
          </div>
        </div>
        <div className="p-4 sm:p-6 rounded-xl shadow-lg 
                        bg-gray-50 dark:bg-gray-800 
                        dark:shadow-gray-900/30 
                        transition-colors duration-500">
          <div className="lg:h-[335px] w-full overflow-hidden">
            <CallsByCity data={cityData} />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-6 p-4 sm:p-6 rounded-xl shadow-lg 
                          bg-gray-50 dark:bg-gray-800 
                          dark:shadow-gray-900/30 
                          transition-colors duration-500 w-full overflow-hidden">
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setTimelineType("hour")}
            className={`px-4 py-1 rounded border 
                        transition-colors duration-500 
                        ${timelineType === "hour" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}
          >
            Hour
          </button>
          <button
            onClick={() => setTimelineType("day")}
            className={`px-4 py-1 rounded border 
                        transition-colors duration-500 
                        ${timelineType === "day" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}
          >
            Day
          </button>
        </div>
        <div className="lg:h-[347px] w-full overflow-hidden">
          <ActivityTimeline data={timelineData} type={timelineType} />
        </div>
      </section>

      {/* Admin Sections */}
      {role === "admin" && (
        <>
          <section className="mt-6 p-4 sm:p-6 rounded-xl shadow-lg 
                              bg-gray-50 dark:bg-gray-800 
                              dark:shadow-gray-900/30 
                              transition-colors duration-500 w-full overflow-hidden">
            <div className="h-[350px] md:h-[260px]w-full overflow-hidden">
              <CostChart data={costData} />
            </div>
          </section>

          <section className="mt-6 p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto
                              bg-gray-50 dark:bg-gray-800 
                              dark:shadow-gray-900/30 
                              transition-colors duration-500 w-full">
            <RecentCallsTable key={searchInput + selectedCity} calls={filteredCalls} loading={loading} />
          </section>
        </>
      )}
    </DashboardLayout>
  );
}