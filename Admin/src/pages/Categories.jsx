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
import { categoryService } from "../services";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
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
  }, [pagination.current]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll(
        pagination.current,
        pagination.limit,
      );
      setCategories(response.data?.data || response.data || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setLoading(true);
      await categoryService.add(categoryName);
      toast.success("Category added successfully!");
      setCategoryName("");
      setIsModalOpen(false);
      setPagination({ ...pagination, current: 1 });
      await fetchCategories();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to add category";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      await categoryService.delete(confirmDialog.id);
      toast.success("Category deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Categories"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Category
          </Button>
        }
      />

      {loading && !categories.length ? (
        <LoadingSpinner />
      ) : categories.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No categories yet. Create one to get started!
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category._id} className="relative">
                <button
                  onClick={() =>
                    setConfirmDialog({ isOpen: true, id: category._id })
                  }
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Delete category"
                >
                  <X size={20} />
                </button>
                <p className="text-lg font-semibold text-gray-900">
                  {category.category}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Added: {new Date(category.createdAt).toLocaleDateString()}
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
        title="Add New Category"
        onClose={() => {
          setIsModalOpen(false);
          setCategoryName("");
        }}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCategory}
              loading={loading}
            >
              Add Category
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCategory}>
          <Input
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Education, Healthcare"
            required
            autoFocus
          />
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        isDangerous
        loading={loading}
        onConfirm={handleDeleteCategory}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default Categories;
