import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          {isDangerous && <AlertTriangle size={24} className="text-red-600" />}
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-4 justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isDangerous ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
