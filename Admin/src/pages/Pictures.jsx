import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import { categoryService, pictureService } from "../services";
import { validations } from "../utils/validations";

const Pictures = () => {
  const [pictures, setPictures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPictures();
  }, [pagination.current, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll(1, 100);
      setCategories(response.data?.data || response.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchPictures = async () => {
    try {
      setLoading(true);
      const response = await pictureService.getAll(
        pagination.current,
        pagination.limit,
        filterCategory,
      );
      setPictures(response.data?.pictures || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch pictures");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (file) {
      if (!validations.isValidFile(file)) {
        setFileError(
          "Invalid file. Please upload an image (JPEG, PNG, GIF, WebP, max 10MB)",
        );
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddPicture = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedFile) {
      toast.error("Please select a category and upload an image");
      return;
    }

    try {
      setLoading(true);
      await pictureService.add(selectedCategory, selectedFile);
      toast.success("Picture added successfully!");
      setSelectedCategory("");
      setSelectedFile(null);
      setIsModalOpen(false);
      setPagination({ ...pagination, current: 1 });
      await fetchPictures();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to add picture";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      setLoading(true);
      await pictureService.delete(confirmDialog.id);
      toast.success("Picture deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchPictures();
    } catch (error) {
      toast.error("Failed to delete picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Pictures"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Picture
          </Button>
        }
      />

      {loading && !pictures.length ? (
        <LoadingSpinner />
      ) : pictures.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No pictures yet. Upload one to get started!
          </p>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <div className="form-group">
              <label className="form-label">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPagination({ ...pagination, current: 1 });
                }}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pictures.map((picture) => (
              <Card
                key={picture._id}
                className="relative group overflow-hidden"
              >
                <button
                  onClick={() =>
                    setConfirmDialog({ isOpen: true, id: picture._id })
                  }
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors z-10"
                  aria-label="Delete picture"
                >
                  <X size={20} />
                </button>
                <img
                  src={picture.picture_link}
                  alt="Gallery"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {picture.category?.category || "Uncategorized"}
                </p>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={(page) =>
              setPagination({ ...pagination, current: page })
            }
          />
        </>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Picture"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory("");
          setSelectedFile(null);
          setFileError("");
        }}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddPicture}
              loading={loading}
            >
              {loading ? "Adding..." : "Add Picture"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddPicture}>
          <div className="form-group">
            <label className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field"
              required
            />
            {fileError && (
              <p className="text-red-500 text-sm mt-1">{fileError}</p>
            )}
            {selectedFile && (
              <p className="text-green-600 text-sm mt-1">
                ✓ File selected: {selectedFile.name}
              </p>
            )}
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Picture"
        message="Are you sure you want to delete this picture?"
        isDangerous
        loading={loading}
        onConfirm={handleDeletePicture}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default Pictures;
