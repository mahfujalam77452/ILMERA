import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import RichTextEditor from "../common/RichTextEditor";
import { activityService } from "../../services";
import { validations } from "../../utils/validations";
import { getEmbedUrl, isValidYouTubeUrl } from "../../utils/youtubeUtils";

const EditActivityModal = ({
  isOpen,
  activity,
  onClose,
  onSuccess,
  loading: parentLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    selectedImages: [],
    existingImages: [],
    videoLink: "",
    projectGoals: [],
    goalInput: "",
    beneficiaries: [],
    beneficiaryInput: "",
    expenseCategories: [],
    expenseCategoryInput: "",
    projectArea: "",
    duration: "",
    paragraphs: [],
    paragraphInput: "",
    editingField: null,
  });

  // Load activity data when modal opens
  useEffect(() => {
    if (isOpen && activity) {
      setFormData({
        title: activity.title || "",
        slug: activity.slug || "",
        summary: activity.summary || "",
        selectedImages: [],
        existingImages: activity.pictures_link_list || [],
        videoLink: activity.video_link || "",
        projectGoals: activity.project_goals || [],
        goalInput: "",
        beneficiaries: activity.beneficiaries || [],
        beneficiaryInput: "",
        expenseCategories: activity.expense_categories || [],
        expenseCategoryInput: "",
        projectArea: activity.project_area || "",
        duration: activity.duration || "",
        paragraphs: Array.isArray(activity.description)
          ? activity.description
          : [activity.description || ""],
        paragraphInput: "",
        editingField: null,
      });
      setEditingIndex(null);
    }
  }, [isOpen, activity]);

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

  // Generic helper for managing arrays (goals, beneficiaries, categories, paragraphs)
  const addItem = (field, inputField) => {
    const inputValue = formData[inputField]?.trim();
    if (!inputValue) {
      toast.error(`Please enter ${field}`);
      return;
    }

    setFormData({
      ...formData,
      [field]: [...formData[field], inputValue],
      [inputField]: "",
    });
    setEditingField(null);
    setEditingIndex(null);
  };

  const removeItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
    setEditingField(null);
    setEditingIndex(null);
  };

  const startEditItem = (field, index, inputField) => {
    setFormData({
      ...formData,
      [inputField]: formData[field][index],
    });
    setEditingField(field);
    setEditingIndex(index);
  };

  const saveItemEdit = (field, inputField) => {
    const inputValue = formData[inputField]?.trim();
    if (!inputValue) {
      toast.error(`Please enter a value`);
      return;
    }

    const updated = [...formData[field]];
    updated[editingIndex] = inputValue;

    setFormData({
      ...formData,
      [field]: updated,
      [inputField]: "",
    });
    setEditingField(null);
    setEditingIndex(null);
  };

  const cancelEdit = (inputField) => {
    setFormData({
      ...formData,
      [inputField]: "",
    });
    setEditingField(null);
    setEditingIndex(null);
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

  const handleUpdateActivity = async (e) => {
    e.preventDefault();

    if (!validateForm() || !activity) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("slug", formData.slug.toLowerCase().trim());
      formDataObj.append("summary", formData.summary);
      formDataObj.append("video_link", formData.videoLink);
      formDataObj.append("project_area", formData.projectArea);
      formDataObj.append("duration", formData.duration);
      formDataObj.append("description", JSON.stringify(formData.paragraphs));
      formDataObj.append(
        "project_goals",
        JSON.stringify(formData.projectGoals),
      );
      formDataObj.append(
        "beneficiaries",
        JSON.stringify(formData.beneficiaries),
      );
      formDataObj.append(
        "expense_categories",
        JSON.stringify(formData.expenseCategories),
      );
      formDataObj.append(
        "existingImages",
        JSON.stringify(formData.existingImages),
      );

      // Append new images
      formData.selectedImages.forEach((image) => {
        formDataObj.append("images", image);
      });

      await activityService.update(activity.slug, formDataObj);
      toast.success("Activity updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to update activity";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!activity) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Activity"
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
            onClick={handleUpdateActivity}
            loading={loading || parentLoading}
          >
            {loading || parentLoading ? "Updating..." : "Update Activity"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleUpdateActivity} className="space-y-6">
        {/* Title, Slug and Summary */}
        <div className="space-y-4">
          <Input
            label="Activity Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., school-renovation"
            required
            helperText="Lowercase letters, numbers, and hyphens only (kebab-case)"
          />
          <Input
            label="Summary"
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
          />
        </div>

        {/* Images */}
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
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Video Link */}
        <div>
          <Input
            label="Video Link (YouTube)"
            value={formData.videoLink}
            onChange={(e) =>
              setFormData({ ...formData, videoLink: e.target.value })
            }
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Project Area and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Project Area"
            value={formData.projectArea}
            onChange={(e) =>
              setFormData({ ...formData, projectArea: e.target.value })
            }
          />
          <Input
            label="Duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>

        {/* Project Goals */}
        <div>
          <h3 className="subsection-title">Project Goals</h3>
          {editingField !== "projectGoals" ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.goalInput}
                onChange={(e) =>
                  setFormData({ ...formData, goalInput: e.target.value })
                }
                placeholder="Add a goal..."
                className="input-field flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addItem("projectGoals", "goalInput")}
              >
                Add
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.goalInput}
                onChange={(e) =>
                  setFormData({ ...formData, goalInput: e.target.value })
                }
                placeholder="Edit goal..."
                className="input-field flex-1"
                autoFocus
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => saveItemEdit("projectGoals", "goalInput")}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => cancelEdit("goalInput")}
              >
                Cancel
              </Button>
            </div>
          )}
          {formData.projectGoals.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.projectGoals.map((goal, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded flex justify-between items-center"
                >
                  <span className="text-sm text-gray-800">{goal}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        startEditItem("projectGoals", index, "goalInput")
                      }
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem("projectGoals", index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Beneficiaries */}
        <div>
          <h3 className="subsection-title">Beneficiaries</h3>
          {editingField !== "beneficiaries" ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.beneficiaryInput}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryInput: e.target.value })
                }
                placeholder="Add a beneficiary..."
                className="input-field flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addItem("beneficiaries", "beneficiaryInput")}
              >
                Add
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.beneficiaryInput}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryInput: e.target.value })
                }
                placeholder="Edit beneficiary..."
                className="input-field flex-1"
                autoFocus
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() =>
                  saveItemEdit("beneficiaries", "beneficiaryInput")
                }
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => cancelEdit("beneficiaryInput")}
              >
                Cancel
              </Button>
            </div>
          )}
          {formData.beneficiaries.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.beneficiaries.map((b, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded flex justify-between items-center"
                >
                  <span className="text-sm text-gray-800">{b}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        startEditItem(
                          "beneficiaries",
                          index,
                          "beneficiaryInput",
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem("beneficiaries", index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense Categories */}
        <div>
          <h3 className="subsection-title">Expense Categories</h3>
          {editingField !== "expenseCategories" ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.expenseCategoryInput}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expenseCategoryInput: e.target.value,
                  })
                }
                placeholder="Add an expense category..."
                className="input-field flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  addItem("expenseCategories", "expenseCategoryInput")
                }
              >
                Add
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.expenseCategoryInput}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expenseCategoryInput: e.target.value,
                  })
                }
                placeholder="Edit category..."
                className="input-field flex-1"
                autoFocus
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() =>
                  saveItemEdit("expenseCategories", "expenseCategoryInput")
                }
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => cancelEdit("expenseCategoryInput")}
              >
                Cancel
              </Button>
            </div>
          )}
          {formData.expenseCategories.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.expenseCategories.map((cat, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded flex justify-between items-center"
                >
                  <span className="text-sm text-gray-800">{cat}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        startEditItem(
                          "expenseCategories",
                          index,
                          "expenseCategoryInput",
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem("expenseCategories", index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paragraphs */}
        <div>
          <h3 className="subsection-title">Description</h3>
          {editingField !== "paragraphs" ? (
            <>
              <RichTextEditor
                value={formData.paragraphInput}
                onChange={(content) =>
                  setFormData({ ...formData, paragraphInput: content })
                }
                placeholder="Add a paragraph with formatting and links..."
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={() => addItem("paragraphs", "paragraphInput")}
              >
                Add Paragraph
              </Button>
            </>
          ) : (
            <>
              <RichTextEditor
                value={formData.paragraphInput}
                onChange={(content) =>
                  setFormData({ ...formData, paragraphInput: content })
                }
                placeholder="Edit paragraph..."
              />
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => saveItemEdit("paragraphs", "paragraphInput")}
                >
                  Save Edit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => cancelEdit("paragraphInput")}
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
                  className="p-3 bg-gray-50 rounded flex justify-between items-start"
                >
                  <div
                    className="text-sm text-gray-800 flex-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: para
                        .substring(0, 100)
                        .concat(para.length > 100 ? "..." : ""),
                    }}
                  />
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        startEditItem("paragraphs", index, "paragraphInput")
                      }
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      title="Edit paragraph"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem("paragraphs", index)}
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

export default EditActivityModal;
