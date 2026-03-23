export const fetchCalls = async () => {
  const res = await fetch("https://call-analytics-dashboard-backend.onrender.com/api/calls", {
    headers: { Authorization: localStorage.getItem("token") },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data || [];
};