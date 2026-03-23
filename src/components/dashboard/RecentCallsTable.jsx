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

  // Function to determine button class based on type
  const paginationButtonClass = ({ isActive = false, isDisabled = false }) => {
    let base = "px-3 py-1 rounded transition-colors duration-200 ";
    let normal = darkMode
      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
      : "bg-gray-300 text-gray-900 hover:bg-gray-400";

    if (isActive) return "bg-blue-500 text-white";
    if (isDisabled) return "opacity-50 cursor-not-allowed";
    return base + normal;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table className={`w-full min-w-[700px] ${bgColor} ${textColor}`}>
          <TableHeader>
            <TableRow>
              {["Caller","Caller Number","Receiver","City","Duration (s)","Cost (£)","Start Time","Call Status"].map(head => (
                <TableHead key={head}>{head}</TableHead>
              ))}
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

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={paginationButtonClass({ isDisabled: currentPage === 1 })}
          >
            Prev
          </button>

          {getPagination().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              disabled={page === "..."}
              className={paginationButtonClass({ isActive: page === currentPage, isDisabled: page === "..." })}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={paginationButtonClass({ isDisabled: currentPage === totalPages })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}