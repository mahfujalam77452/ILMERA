import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
          Previous
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
