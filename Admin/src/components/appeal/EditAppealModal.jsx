import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import { appealService } from "../../services";
import { validations } from "../../utils/validations";

const EditAppealModal = ({
  isOpen,
  appeal,
  onClose,
  onSuccess,
  loading: parentLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [formData, setFormData] = useState({
    appeal: "",
    slug: "",
    selectedImage: null,
    existingImage: null,
    titleEn: "",
    titleBn: "",
    sections: [],
    sectionType: "heading",
    sectionContentEn: "",
    sectionContentBn: "",
    sectionOrder: 1,
  });

  // Load appeal data when modal opens
  useEffect(() => {
    if (isOpen && appeal) {
      setFormData({
        appeal: appeal.appeal || "",
        slug: appeal.slug || "",
        selectedImage: null,
        existingImage: appeal.image || null,
        titleEn: appeal.title?.en || "",
        titleBn: appeal.title?.bn || "",
        sections: appeal.sections ? [...appeal.sections] : [],
        sectionType: "heading",
        sectionContentEn: "",
        sectionContentBn: "",
        sectionOrder: 1,
      });
      setEditingSectionIndex(null);
    }
  }, [isOpen, appeal]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!validations.isValidFile(file)) {
        toast.error("Invalid file. Please upload an image (max 10MB)");
        setFormData({ ...formData, selectedImage: null });
        return;
      }
      setFormData({ ...formData, selectedImage: file });
    }
  };

  const addSection = () => {
    if (
      !formData.sectionContentEn.trim() ||
      !formData.sectionContentBn.trim()
    ) {
      toast.error("Please fill both English and Bengali content");
      return;
    }

    const newSection = {
      type: formData.sectionType,
      content: {
        en: formData.sectionContentEn,
        bn: formData.sectionContentBn,
      },
      order: formData.sectionOrder,
    };

    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
      sectionContentEn: "",
      sectionContentBn: "",
      sectionOrder: formData.sectionOrder + 1,
    });
  };

  const removeSection = (index) => {
    const updated = formData.sections.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      sections: updated,
    });
  };

  const startEditSection = (index) => {
    const section = formData.sections[index];
    setFormData({
      ...formData,
      sectionType: section.type,
      sectionContentEn: section.content.en,
      sectionContentBn: section.content.bn,
      sectionOrder: section.order,
    });
    setEditingSectionIndex(index);
  };

  const saveEditSection = () => {
    if (
      !formData.sectionContentEn.trim() ||
      !formData.sectionContentBn.trim()
    ) {
      toast.error("Please fill both English and Bengali content");
      return;
    }

    const updated = [...formData.sections];
    updated[editingSectionIndex] = {
      type: formData.sectionType,
      content: {
        en: formData.sectionContentEn,
        bn: formData.sectionContentBn,
      },
      order: formData.sectionOrder,
    };

    setFormData({
      ...formData,
      sections: updated,
      sectionContentEn: "",
      sectionContentBn: "",
    });
    setEditingSectionIndex(null);
  };

  const cancelEditSection = () => {
    setFormData({
      ...formData,
      sectionContentEn: "",
      sectionContentBn: "",
    });
    setEditingSectionIndex(null);
  };

  const validateForm = () => {
    if (!formData.appeal.trim()) {
      toast.error("Appeal name is required");
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

    if (!formData.titleEn.trim() || !formData.titleBn.trim()) {
      toast.error("Please fill both English and Bengali titles");
      return false;
    }

    if (!formData.existingImage && !formData.selectedImage) {
      toast.error("Please select or keep an appeal image");
      return false;
    }

    if (formData.sections.length === 0) {
      toast.error("Please add at least one section");
      return false;
    }

    return true;
  };

  const handleUpdateAppeal = async (e) => {
    e.preventDefault();

    if (!validateForm() || !appeal) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("appeal", formData.appeal);
      formDataObj.append("slug", formData.slug.toLowerCase().trim());
      formDataObj.append(
        "title",
        JSON.stringify({
          en: formData.titleEn,
          bn: formData.titleBn,
        }),
      );
      formDataObj.append("sections", JSON.stringify(formData.sections));

      if (formData.selectedImage) {
        formDataObj.append("image", formData.selectedImage);
      }

      await appealService.update(appeal.slug, formDataObj);
      toast.success("Appeal updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update appeal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!appeal) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Appeal"
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
            onClick={handleUpdateAppeal}
            loading={loading || parentLoading}
          >
            {loading || parentLoading ? "Updating..." : "Update Appeal"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleUpdateAppeal} className="space-y-6">
        {/* Appeal Name and Slug */}
        <div className="space-y-4">
          <Input
            label="Appeal Name"
            value={formData.appeal}
            onChange={(e) =>
              setFormData({ ...formData, appeal: e.target.value })
            }
            required
          />

          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., the-flood-of-bangladesh"
            required
            helperText="Lowercase letters, numbers, and hyphens only (kebab-case)"
          />
        </div>

        {/* Titles */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Title (English)"
            value={formData.titleEn}
            onChange={(e) =>
              setFormData({ ...formData, titleEn: e.target.value })
            }
            required
          />
          <Input
            label="Title (Bengali)"
            value={formData.titleBn}
            onChange={(e) =>
              setFormData({ ...formData, titleBn: e.target.value })
            }
            required
          />
        </div>

        {/* Image */}
        <div>
          <h3 className="subsection-title">Appeal Image</h3>
          {formData.existingImage && !formData.selectedImage && (
            <div className="mb-4">
              <img
                src={formData.existingImage}
                alt="Current"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">Current image</p>
            </div>
          )}

          {formData.selectedImage && (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(formData.selectedImage)}
                alt="New"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">New image</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a new image to replace the current one
          </p>
        </div>

        {/* Sections */}
        <div>
          <h3 className="subsection-title">Content Sections</h3>

          {editingSectionIndex === null ? (
            <div className="space-y-3">
              <select
                value={formData.sectionType}
                onChange={(e) =>
                  setFormData({ ...formData, sectionType: e.target.value })
                }
                className="input-field"
              >
                <option value="heading">Heading</option>
                <option value="paragraph">Paragraph</option>
                <option value="highlight">Highlight</option>
                <option value="quote">Quote</option>
              </select>

              <textarea
                value={formData.sectionContentEn}
                onChange={(e) =>
                  setFormData({ ...formData, sectionContentEn: e.target.value })
                }
                placeholder="Content in English..."
                className="input-field h-20 resize-none"
              />

              <textarea
                value={formData.sectionContentBn}
                onChange={(e) =>
                  setFormData({ ...formData, sectionContentBn: e.target.value })
                }
                placeholder="বিষয়বস্তু বাংলায়..."
                className="input-field h-20 resize-none"
              />

              <Input
                label="Section Order"
                type="number"
                value={formData.sectionOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sectionOrder: parseInt(e.target.value),
                  })
                }
                min="1"
              />

              <Button type="button" variant="secondary" onClick={addSection}>
                Add Section
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={formData.sectionType}
                onChange={(e) =>
                  setFormData({ ...formData, sectionType: e.target.value })
                }
                className="input-field"
              >
                <option value="heading">Heading</option>
                <option value="paragraph">Paragraph</option>
                <option value="highlight">Highlight</option>
                <option value="quote">Quote</option>
              </select>

              <textarea
                value={formData.sectionContentEn}
                onChange={(e) =>
                  setFormData({ ...formData, sectionContentEn: e.target.value })
                }
                placeholder="Content in English..."
                className="input-field h-20 resize-none"
                autoFocus
              />

              <textarea
                value={formData.sectionContentBn}
                onChange={(e) =>
                  setFormData({ ...formData, sectionContentBn: e.target.value })
                }
                placeholder="বিষয়বস্তু বাংলায়..."
                className="input-field h-20 resize-none"
              />

              <Input
                label="Section Order"
                type="number"
                value={formData.sectionOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sectionOrder: parseInt(e.target.value),
                  })
                }
                min="1"
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={saveEditSection}
                >
                  Save Edit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={cancelEditSection}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {formData.sections.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.sections.map((section, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {section.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        Order: {section.order}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEditSection(index)}
                        className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-1">
                    <strong>EN:</strong> {section.content.en}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>BN:</strong> {section.content.bn}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditAppealModal;
