import React from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  footer = null,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-6 flex justify-end gap-4 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
