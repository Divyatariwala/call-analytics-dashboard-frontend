import { useMemo, useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function RecentCallsTable({ calls = [], loading = false, darkMode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const recordsPerPage = 50;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredCalls = useMemo(() => calls || [], [calls]);
  const totalPages = Math.ceil(filteredCalls.length / recordsPerPage);

  const paginatedCalls = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return filteredCalls.slice(start, end);
  }, [filteredCalls, currentPage]);

  const textColor = darkMode ? "text-gray-200" : "text-gray-900";
  const bgColor = darkMode ? "bg-gray-800" : "bg-white";

  if (loading) return <p className="text-center py-6">Loading calls...</p>;
  if (!calls.length) return <p className="text-center py-6">No calls found.</p>;

  // Responsive pagination: show fewer pages on small screens
  const getPagination = () => {
    const pages = [];
    const maxVisible = screenWidth < 640 ? 3 : 5; // mobile: 3 pages, desktop: 5
    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table className={`w-full min-w-[700px] ${bgColor} ${textColor}`}>
          <TableHeader>
            <TableRow>
              {["Caller","Caller Number","Receiver","City","Duration (s)","Cost (£)","Start Time","Call Status"].map(head => <TableHead key={head}>{head}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCalls.map((c) => (
              <TableRow key={c.id || c._id}>
                <TableCell>{c.callerName || "-"}</TableCell>
                <TableCell>{c.callerNumber || "-"}</TableCell>
                <TableCell>{c.receiverNumber || "-"}</TableCell>
                <TableCell>{c.city || "-"}</TableCell>
                <TableCell>{c.callDuration || 0}</TableCell>
                <TableCell>{c.callCost ? `£${c.callCost}` : "£0.00"}</TableCell>
                <TableCell>{c.callStartTime ? new Date(c.callStartTime).toLocaleString() : "-"}</TableCell>
                <TableCell>{c.callStatus === true ? "True" : c.callStatus === false ? "False" : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Responsive Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-1 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev-1,1))}
            disabled={currentPage===1}
            className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:opacity-80 disabled:opacity-50"
          >
            Prev
          </button>

          {getPagination().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              disabled={page === "..."}
              className={`px-2 py-1 rounded ${currentPage===page ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700 hover:opacity-80'}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev+1,totalPages))}
            disabled={currentPage===totalPages}
            className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:opacity-80 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}