import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import { blogService } from "../../services";
import { validations } from "../../utils/validations";

const EditBlogModal = ({
  isOpen,
  blog,
  onClose,
  onSuccess,
  loading: parentLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [editingParagraphIndex, setEditingParagraphIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: new Date().toISOString().split("T")[0],
    selectedImages: [], // New images to upload
    existingImages: [], // Images kept from original
    paragraphs: [],
    paragraphInput: "",
  });

  // Load blog data when modal opens
  useEffect(() => {
    if (isOpen && blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        date: new Date(blog.date).toISOString().split("T")[0],
        selectedImages: [],
        existingImages: blog.pictures_link_list || [],
        paragraphs: Array.isArray(blog.description)
          ? blog.description
          : [blog.description || ""],
        paragraphInput: "",
      });
    }
  }, [isOpen, blog]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => validations.isValidFile(file));

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files are invalid. Please upload images only (max 10MB)",
      );
    }

    const maxAllowed =
      5 - formData.existingImages.length - formData.selectedImages.length;
    const newImages = validFiles.slice(0, maxAllowed);
    setFormData({
      ...formData,
      selectedImages: [...formData.selectedImages, ...newImages],
    });
  };

  const removeNewImage = (index) => {
    setFormData({
      ...formData,
      selectedImages: formData.selectedImages.filter((_, i) => i !== index),
    });
  };

  const removeExistingImage = (index) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter((_, i) => i !== index),
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

  const startEditParagraph = (index) => {
    setFormData({
      ...formData,
      paragraphInput: formData.paragraphs[index],
    });
    setEditingParagraphIndex(index);
  };

  const saveParagraphEdit = () => {
    if (!formData.paragraphInput.trim()) {
      toast.error("Please enter paragraph text");
      return;
    }

    const updatedParagraphs = [...formData.paragraphs];
    updatedParagraphs[editingParagraphIndex] = formData.paragraphInput;

    setFormData({
      ...formData,
      paragraphs: updatedParagraphs,
      paragraphInput: "",
    });
    setEditingParagraphIndex(null);
  };

  const cancelEditParagraph = () => {
    setFormData({
      ...formData,
      paragraphInput: "",
    });
    setEditingParagraphIndex(null);
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

    const totalImages =
      formData.existingImages.length + formData.selectedImages.length;
    if (totalImages === 0) {
      toast.error("Please keep or select at least one image");
      return false;
    }

    if (formData.paragraphs.length === 0) {
      toast.error("Please add at least one paragraph");
      return false;
    }

    return true;
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    if (!validateForm() || !blog) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("slug", formData.slug.toLowerCase().trim());
      formDataObj.append("date", formData.date);
      formDataObj.append("description", JSON.stringify(formData.paragraphs));
      formDataObj.append(
        "existingImages",
        JSON.stringify(formData.existingImages),
      );

      // Append new images
      formData.selectedImages.forEach((image) => {
        formDataObj.append("images", image);
      });

      await blogService.update(blog.slug, formDataObj);
      toast.success("Blog updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update blog";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!blog) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Blog"
      onClose={onClose}
      size="xl"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading || parentLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateBlog}
            loading={loading || parentLoading}
          >
            {loading || parentLoading ? "Updating..." : "Update Blog"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleUpdateBlog} className="space-y-6">
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
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., impact-of-our-programs"
            required
            helperText="Lowercase letters, numbers, and hyphens only (kebab-case)"
          />

          <Input
            label="Publication Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Existing Images */}
        {formData.existingImages.length > 0 && (
          <div>
            <h3 className="subsection-title">Current Images</h3>
            <div className="grid grid-cols-4 gap-2">
              {formData.existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt="Current"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    title="Remove this image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload */}
        <div>
          <h3 className="subsection-title">
            Add New Images (Max{" "}
            {5 -
              formData.existingImages.length -
              formData.selectedImages.length}{" "}
            more)
          </h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            disabled={
              formData.existingImages.length + formData.selectedImages.length >=
              5
            }
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
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
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
          {editingParagraphIndex === null ? (
            <>
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
            </>
          ) : (
            <>
              <textarea
                value={formData.paragraphInput}
                onChange={(e) =>
                  setFormData({ ...formData, paragraphInput: e.target.value })
                }
                placeholder="Edit paragraph..."
                className="input-field h-24 resize-none"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={saveParagraphEdit}
                >
                  Save Edit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={cancelEditParagraph}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {formData.paragraphs.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.paragraphs.map((para, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg flex justify-between items-start"
                >
                  <p className="text-sm text-gray-800 flex-1">{para}</p>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditParagraph(index)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      title="Edit paragraph"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                      title="Delete paragraph"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditBlogModal;
