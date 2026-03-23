import { useMemo, useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function RecentCallsTable({ calls = [], loading = false }) {
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

  // Clean pagination button styles without dark mode
  const paginationButtonClass = ({ isActive = false, isDisabled = false }) => {
    const base = "px-4 py-1 rounded-lg font-medium transition-all duration-200 ";
    
    if (isActive) {
      return base + "bg-blue-600 text-white shadow-md hover:bg-blue-700 ring-2 ring-blue-300";
    }
    
    if (isDisabled) {
      return base + "bg-gray-300 text-gray-400 cursor-not-allowed";
    }
    
    return base + "bg-gray-200 text-gray-900 hover:bg-gray-300";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[700px] bg-white text-gray-900">
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