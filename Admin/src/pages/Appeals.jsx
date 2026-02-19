import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ChevronDown } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import { appealService } from "../services";
import { validations } from "../utils/validations";

const Appeals = () => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    appeal: "",
    selectedImage: null,
    titleEn: "",
    titleBn: "",
    sections: [],
    sectionType: "heading",
    sectionContentEn: "",
    sectionContentBn: "",
    sectionOrder: 1,
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
    fetchAppeals();
  }, [pagination.current]);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const response = await appealService.getAll(
        pagination.current,
        pagination.limit,
      );
      // Response is directly an array of appeals
      setAppeals(Array.isArray(response) ? response : response || []);
    } catch (error) {
      console.error("Failed to fetch appeals:", error);
      toast.error("Failed to fetch appeals");
    } finally {
      setLoading(false);
    }
  };

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
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    if (!formData.appeal.trim()) {
      toast.error("Appeal name is required");
      return false;
    }

    if (!formData.selectedImage) {
      toast.error("Please select an image");
      return false;
    }

    if (!formData.titleEn.trim() || !formData.titleBn.trim()) {
      toast.error("Please fill title in both English and Bengali");
      return false;
    }

    if (formData.sections.length === 0) {
      toast.error("Please add at least one section");
      return false;
    }

    return true;
  };

  const handleAddAppeal = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("appeal", formData.appeal);
      formDataObj.append(
        "title",
        JSON.stringify({
          en: formData.titleEn,
          bn: formData.titleBn,
        }),
      );
      formDataObj.append("sections", JSON.stringify(formData.sections));
      formDataObj.append("image", formData.selectedImage);

      await appealService.add(formDataObj);
      toast.success("Appeal added successfully!");

      // Reset form
      setFormData({
        appeal: "",
        selectedImage: null,
        titleEn: "",
        titleBn: "",
        sections: [],
        sectionType: "heading",
        sectionContentEn: "",
        sectionContentBn: "",
        sectionOrder: 1,
      });
      setIsModalOpen(false);
      setPagination({ ...pagination, current: 1 });
      await fetchAppeals();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to add appeal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppeal = async () => {
    try {
      setLoading(true);
      await appealService.delete(confirmDialog.id);
      toast.success("Appeal deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchAppeals();
    } catch (error) {
      toast.error("Failed to delete appeal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Appeals"
        subtitle="Manage emergency and special appeals"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Create Appeal
          </Button>
        }
      />

      {loading && !appeals.length ? (
        <LoadingSpinner />
      ) : appeals.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No appeals yet. Create one to get started!
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appeals.map((appeal) => (
              <div
                key={appeal._id}
                className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
                onClick={() =>
                  setExpandedId(expandedId === appeal._id ? null : appeal._id)
                }
              >
                {appeal.image && (
                  <img
                    src={appeal.image}
                    alt={appeal.appeal}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {appeal.appeal}
                  </h3>

                  <p className="text-xs text-gray-500 mb-4">
                    Added: {new Date(appeal.createdAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDialog({
                        isOpen: true,
                        id: appeal._id,
                      });
                    }}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow"
                    aria-label="Delete appeal"
                  >
                    <X size={20} />
                  </button>

                  {expandedId === appeal._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 font-medium">
                        Click outside or elsewhere to collapse
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
        title="Create New Appeal"
        size="xl"
        onClose={() => {
          setIsModalOpen(false);
          setFormData({
            appeal: "",
            selectedImage: null,
            titleEn: "",
            titleBn: "",
            sections: [],
            sectionType: "heading",
            sectionContentEn: "",
            sectionContentBn: "",
            sectionOrder: 1,
          });
        }}
      >
        <form onSubmit={handleAddAppeal} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="subsection-title">Basic Information</h3>
            <div className="space-y-4">
              <Input
                label="Appeal Name"
                value={formData.appeal}
                onChange={(e) =>
                  setFormData({ ...formData, appeal: e.target.value })
                }
                placeholder="e.g., The Flood of Bangladesh"
                required
              />

              <div>
                <label className="form-label">Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="input-field"
                  required
                />
                {formData.selectedImage && (
                  <p className="text-green-600 text-sm mt-2">
                    ✓ {formData.selectedImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bilingual Title */}
          <div>
            <h3 className="subsection-title">Title</h3>
            <div className="space-y-4">
              <Input
                label="English Title"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                placeholder="Enter title in English"
                required
              />

              <Input
                label="Bengali Title"
                value={formData.titleBn}
                onChange={(e) =>
                  setFormData({ ...formData, titleBn: e.target.value })
                }
                placeholder="বাংলায় শিরোনাম লিখুন"
                required
              />
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="subsection-title">Content Sections</h3>

            {/* Add Section Form */}
            <Card className="bg-gray-50 mb-4">
              <h4 className="font-semibold text-gray-900 mb-4">Add Section</h4>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Section Type</label>
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
                </div>

                <Input
                  label="Content (English)"
                  value={formData.sectionContentEn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sectionContentEn: e.target.value,
                    })
                  }
                  placeholder="Enter content in English"
                />

                <Input
                  label="Content (Bengali)"
                  value={formData.sectionContentBn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sectionContentBn: e.target.value,
                    })
                  }
                  placeholder="বাংলায় কন্টেন্ট লিখুন"
                />

                <Button variant="secondary" onClick={addSection} type="button">
                  Add Section
                </Button>
              </div>
            </Card>

            {/* Sections List */}
            {formData.sections.length > 0 && (
              <div className="space-y-3">
                <p className="font-medium text-gray-900">
                  Added Sections ({formData.sections.length})
                </p>
                {formData.sections.map((section, index) => (
                  <Card key={index} className="bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {section.type}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          {section.content.en}
                        </p>
                      </div>
                      <button
                        onClick={() => removeSection(index)}
                        className="text-red-600 hover:text-red-800"
                        type="button"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Appeal"}
          </Button>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Appeal"
        message="Are you sure you want to delete this appeal? This action cannot be undone."
        isDangerous
        loading={loading}
        onConfirm={handleDeleteAppeal}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default Appeals;
