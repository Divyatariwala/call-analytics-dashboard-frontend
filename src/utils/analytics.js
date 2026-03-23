// analytics.js
// Utility functions to calculate KPIs and stats for call analytics

// Helper: ensure we always get an array of calls
const normalizeCalls = (calls) => {
  return calls.map(c => ({
    ...c,
    callStatus: String(c.callStatus).trim().toLowerCase() === "true"
  }));
};

// Helper: safely parse numbers
const parseNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// ---------------- KPI CALCULATION ----------------
export const calculateKPIs = (rawCalls) => {
  const calls = normalizeCalls(rawCalls);

  const totalCalls = calls.length;
  const totalCost = calls.reduce((sum, c) => sum + parseNumber(c.callCost), 0);
  const avgDuration =
    totalCalls === 0
      ? 0
      : calls.reduce((sum, c) => sum + parseNumber(c.callDuration), 0) / totalCalls;

  const successfulCalls = calls.filter(c => c.callStatus === true).length;
const failedCalls = calls.length - successfulCalls;

console.log("Sample call object:", calls[0]);
  return {
    totalCalls,
    totalCost: totalCost.toFixed(2),
    avgDuration: avgDuration.toFixed(2),
    successfulCalls,
    failedCalls,
  };
};

// ---------------- CALL DURATION STATS ----------------
export function getCallDurationStats(rawCalls) {
  const calls = normalizeCalls(rawCalls);
  if (calls.length === 0) return [];

  const durations = calls.map(c => parseNumber(c.callDuration));
  const longest = Math.max(...durations);
  const shortest = Math.min(...durations);
  const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;

  return [
    { name: "Longest Call", duration: longest },
    { name: "Shortest Call", duration: shortest },
    { name: "Average Duration", duration: Number(average.toFixed(2)) }
  ];
}

// ---------------- CALLS PER DAY ----------------
export function getCallsPerDay(rawCalls) {
  const calls = normalizeCalls(rawCalls);
  if (calls.length === 0) return [];

  const days = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  calls.forEach(c => {
    if (!c.callStartTime) return;
    const day = new Date(c.callStartTime).toLocaleDateString("en-US", { weekday: "short" });
    if (days.hasOwnProperty(day)) days[day] += 1;
  });

  return Object.keys(days).map(day => ({ day, calls: days[day] }));
}

// ---------------- CALLS PER HOUR ----------------
export const getCallsPerHour = (rawCalls) => {
  const calls = normalizeCalls(rawCalls);
  if (calls.length === 0) return [];

  const hours = {};
  calls.forEach(c => {
    if (!c.callStartTime) return;
    const hour = new Date(c.callStartTime).getHours();
    hours[hour] = (hours[hour] || 0) + 1;
  });

  return Object.keys(hours).map(hour => ({ hour, calls: hours[hour] }));
};

// ---------------- CALLS BY CITY ----------------
export const getCallsByCity = (rawCalls) => {
  const calls = normalizeCalls(rawCalls);
  if (calls.length === 0) return [];

  const cities = {};
  calls.forEach(c => {
    const city = c.city || "Unknown";
    cities[city] = (cities[city] || 0) + 1;
  });

  return Object.keys(cities).map(city => ({ city, calls: cities[city] }));
};

// ---------------- COST BY CITY ----------------
export const getCostByCity = (rawCalls) => {
  const calls = normalizeCalls(rawCalls);
  if (calls.length === 0) return [];

  const cities = {};
  calls.forEach(c => {
    const city = c.city || "Unknown";
    const cost = parseNumber(c.callCost);

    if (!cities[city]) cities[city] = { totalCost: 0, callCount: 0 };
    cities[city].totalCost += cost;
    cities[city].callCount += 1;
  });

  return Object.keys(cities).map(city => ({
    city,
    totalCost: Number(cities[city].totalCost.toFixed(2)),
    avgCost: Number((cities[city].totalCost / cities[city].callCount).toFixed(2))
  }));
};