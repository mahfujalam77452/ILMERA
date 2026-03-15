import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ChevronDown, Edit } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import EditBlogModal from "../components/blog/EditBlogModal";
import { blogService } from "../services";
import { validations } from "../utils/validations";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: new Date().toISOString().split("T")[0],
    selectedImages: [],
    paragraphs: [],
    paragraphInput: "",
  });

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
    fetchBlogs();
  }, [pagination.current]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAll(
        pagination.current,
        pagination.limit,
      );
      setBlogs(response.data?.blogs || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => validations.isValidFile(file));

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files are invalid. Please upload images only (max 10MB)",
      );
    }

    const newImages = validFiles.slice(0, 5 - formData.selectedImages.length);
    setFormData({
      ...formData,
      selectedImages: [...formData.selectedImages, ...newImages],
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      selectedImages: formData.selectedImages.filter((_, i) => i !== index),
    });
  };

  const addParagraph = () => {
    if (!formData.paragraphInput.trim()) {
      toast.error("Please enter paragraph text");
      return;
    }

    setFormData({
      ...formData,
      paragraphs: [...formData.paragraphs, formData.paragraphInput],
      paragraphInput: "",
    });
  };

  const removeParagraph = (index) => {
    setFormData({
      ...formData,
      paragraphs: formData.paragraphs.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug.toLowerCase())) {
      toast.error(
        "Slug must be in kebab-case format (lowercase letters, numbers, and hyphens only)",
      );
      return false;
    }

    if (formData.selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return false;
    }

    if (formData.paragraphs.length === 0) {
      toast.error("Please add at least one paragraph");
      return false;
    }

    return true;
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("slug", formData.slug.toLowerCase().trim());
      formDataObj.append("date", formData.date);
      formDataObj.append("description", JSON.stringify(formData.paragraphs));

      formData.selectedImages.forEach((image) => {
        formDataObj.append("images", image);
      });

      await blogService.add(formDataObj);
      toast.success("Blog added successfully!");

      // Reset form
      setFormData({
        title: "",
        slug: "",
        date: new Date().toISOString().split("T")[0],
        selectedImages: [],
        paragraphs: [],
        paragraphInput: "",
      });

      setIsModalOpen(false);
      setPagination({ ...pagination, current: 1 });
      await fetchBlogs();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to add blog";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    try {
      setLoading(true);
      const blog = blogs.find((b) => b._id === confirmDialog.id);
      await blogService.delete(blog.slug);
      toast.success("Blog deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setEditingBlog(null);
    setIsEditModalOpen(false);
    await fetchBlogs();
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Blogs"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Blog
          </Button>
        }
      />

      {loading && !blogs.length ? (
        <LoadingSpinner />
      ) : blogs.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No blogs yet. Create one to get started!
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {blogs.map((blog) => {
              const isExpanded = expandedId === blog._id;
              const firstImage = blog.pictures_link_list?.[0];

              return (
                <Card
                  key={blog._id}
                  className="relative"
                  onClick={() => setExpandedId(isExpanded ? null : blog._id)}
                >
                  <div className="flex gap-4 cursor-pointer">
                    {firstImage && (
                      <img
                        src={firstImage}
                        alt={blog.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(blog.date).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBlog(blog);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors self-start"
                      aria-label="Edit blog"
                      title="Edit blog"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog({ isOpen: true, id: blog._id });
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors self-start"
                      aria-label="Delete blog"
                    >
                      <X size={20} />
                    </button>

                    <ChevronDown
                      size={20}
                      className={`transition-transform self-center ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {blog.description?.en ||
                          blog.paragraphs?.join("\n\n") ||
                          "No content"}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
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
        title="Add New Blog"
        onClose={() => {
          setIsModalOpen(false);
          setFormData({
            title: "",
            slug: "",
            date: new Date().toISOString().split("T")[0],
            selectedImages: [],
            paragraphs: [],
            paragraphInput: "",
          });
        }}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddBlog} loading={loading}>
              {loading ? "Adding..." : "Add Blog"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddBlog} className="space-y-6">
          {/* Title, Slug and Date */}
          <div className="space-y-4">
            <Input
              label="Blog Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Impact of Our Programs"
              required
            />

            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g., impact-of-our-programs"
              required
              helperText="Lowercase letters, numbers, and hyphens only (kebab-case)"
            />

            <Input
              label="Publication Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          {/* Images */}
          <div>
            <h3 className="subsection-title">Images (Max 5)</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              disabled={formData.selectedImages.length >= 5}
              className="input-field"
            />

            {formData.selectedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {formData.selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paragraphs */}
          <div>
            <h3 className="subsection-title">Content</h3>
            <textarea
              value={formData.paragraphInput}
              onChange={(e) =>
                setFormData({ ...formData, paragraphInput: e.target.value })
              }
              placeholder="Write a paragraph..."
              className="input-field h-24 resize-none"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={addParagraph}
            >
              Add Paragraph
            </Button>

            {formData.paragraphs.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.paragraphs.map((para, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between"
                  >
                    <p className="text-sm text-gray-800 flex-1">{para}</p>
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Edit Blog Modal */}
      <EditBlogModal
        isOpen={isEditModalOpen}
        blog={editingBlog}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBlog(null);
        }}
        onSuccess={handleEditSuccess}
        loading={loading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Blog"
        message="Are you sure you want to delete this blog?"
        isDangerous
        loading={loading}
        onConfirm={handleDeleteBlog}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default Blogs;
