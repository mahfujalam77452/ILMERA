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
import EditActivityModal from "../components/activity/EditActivityModal";
import RichTextEditor from "../components/common/RichTextEditor";
import { activityService, categoryService } from "../services";
import { getEmbedUrl, isValidYouTubeUrl } from "../utils/youtubeUtils";
import { validations } from "../utils/validations";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    selectedImages: [],
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
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [pagination.current]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll(1, 100);
      setCategories(response.data?.data || response.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAll(
        pagination.current,
        pagination.limit,
      );
      setActivities(response.data?.activities || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch activities");
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

  const addArrayItem = (arrayName, inputName, item) => {
    if (!item.trim()) {
      toast.error(`Please enter a ${inputName}`);
      return;
    }

    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], item],
      [inputName]: "",
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData({
      ...formData,
      [arrayName]: formData[arrayName].filter((_, i) => i !== index),
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

  const handleAddActivity = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("slug", formData.slug.toLowerCase().trim());
      formDataObj.append("summary", formData.summary || "");
      formDataObj.append("video_link", formData.videoLink || "");
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
      formDataObj.append("project_area", formData.projectArea);
      formDataObj.append("duration", formData.duration);
      formDataObj.append("description", JSON.stringify(formData.paragraphs));

      formData.selectedImages.forEach((image) => {
        formDataObj.append("images", image);
      });

      await activityService.add(formDataObj);
      toast.success("Activity added successfully!");

      // Reset form
      setFormData({
        title: "",
        slug: "",
        summary: "",
        selectedImages: [],
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
      });

      setIsModalOpen(false);
      setPagination({ ...pagination, current: 1 });
      await fetchActivities();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to add activity";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async () => {
    try {
      setLoading(true);
      const activity = activities.find((a) => a._id === confirmDialog.id);
      await activityService.delete(activity.slug);
      toast.success("Activity deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchActivities();
    } catch (error) {
      toast.error("Failed to delete activity");
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setEditingActivity(null);
    setIsEditModalOpen(false);
    await fetchActivities();
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Activities"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Activity
          </Button>
        }
      />

      {loading && !activities.length ? (
        <LoadingSpinner />
      ) : activities.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No activities yet. Create one to get started!
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {activities.map((activity) => {
              const isExpanded = expandedId === activity._id;
              const firstImage = activity.pictures_link_list?.[0];

              return (
                <Card
                  key={activity._id}
                  className="relative"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : activity._id)
                  }
                >
                  <div className="flex gap-4 cursor-pointer">
                    {firstImage && (
                      <img
                        src={firstImage}
                        alt={activity.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.summary}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditActivity(activity);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors self-start"
                      aria-label="Edit activity"
                      title="Edit activity"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog({ isOpen: true, id: activity._id });
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors self-start"
                      aria-label="Delete activity"
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
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      {activity.project_goals?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Goals:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {activity.project_goals.map((goal, i) => (
                              <li key={i}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activity.beneficiaries?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Beneficiaries:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {activity.beneficiaries.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Added:{" "}
                        {new Date(activity.createdAt).toLocaleDateString()}
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
        title="Add New Activity"
        onClose={() => {
          setIsModalOpen(false);
          setFormData({
            title: "",
            slug: "",
            summary: "",
            selectedImages: [],
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
          });
        }}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddActivity}
              loading={loading}
            >
              {loading ? "Adding..." : "Add Activity"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddActivity} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="subsection-title">Basic Information</h3>
            <Input
              label="Activity Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., School Renovation"
              required
            />

            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
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
              placeholder="Brief description"
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

          {/* Video */}
          <div>
            <h3 className="subsection-title">Video Link</h3>
            <Input
              label="YouTube Video URL"
              type="url"
              value={formData.videoLink}
              onChange={(e) =>
                setFormData({ ...formData, videoLink: e.target.value })
              }
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          {/* Paragraphs */}
          <div>
            <h3 className="subsection-title">Description (Paragraphs)</h3>
            <RichTextEditor
              value={formData.paragraphInput}
              onChange={(content) =>
                setFormData({ ...formData, paragraphInput: content })
              }
              placeholder="Write a paragraph with formatting and links..."
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() =>
                addArrayItem(
                  "paragraphs",
                  "paragraphInput",
                  formData.paragraphInput,
                )
              }
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
                    <div
                      className="text-sm text-gray-800 flex-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: para
                          .substring(0, 100)
                          .concat(para.length > 100 ? "..." : ""),
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("paragraphs", index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goals */}
          <div>
            <h3 className="subsection-title">Project Goals & Objectives</h3>
            <Input
              value={formData.goalInput}
              onChange={(e) =>
                setFormData({ ...formData, goalInput: e.target.value })
              }
              placeholder="Add a goal..."
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() =>
                addArrayItem("projectGoals", "goalInput", formData.goalInput)
              }
            >
              Add Goal
            </Button>

            {formData.projectGoals.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.projectGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="p-2 bg-blue-50 rounded flex justify-between"
                  >
                    <span className="text-sm text-gray-800">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("projectGoals", index)}
                      className="text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Beneficiaries */}
          <div>
            <h3 className="subsection-title">Beneficiaries</h3>
            <Input
              value={formData.beneficiaryInput}
              onChange={(e) =>
                setFormData({ ...formData, beneficiaryInput: e.target.value })
              }
              placeholder="Add a beneficiary group..."
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() =>
                addArrayItem(
                  "beneficiaries",
                  "beneficiaryInput",
                  formData.beneficiaryInput,
                )
              }
            >
              Add Beneficiary
            </Button>

            {formData.beneficiaries.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.beneficiaries.map((b, index) => (
                  <div
                    key={index}
                    className="p-2 bg-green-50 rounded flex justify-between"
                  >
                    <span className="text-sm text-gray-800">{b}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("beneficiaries", index)}
                      className="text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Details */}
          <div>
            <h3 className="subsection-title">Project Details</h3>

            <Input
              label="Project Area"
              value={formData.projectArea}
              onChange={(e) =>
                setFormData({ ...formData, projectArea: e.target.value })
              }
              placeholder="e.g., Dhaka"
            />

            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              placeholder="e.g., 3 months"
            />
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="subsection-title">Expense Categories</h3>
            <Input
              value={formData.expenseCategoryInput}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expenseCategoryInput: e.target.value,
                })
              }
              placeholder="Add an expense category..."
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() =>
                addArrayItem(
                  "expenseCategories",
                  "expenseCategoryInput",
                  formData.expenseCategoryInput,
                )
              }
            >
              Add Category
            </Button>

            {formData.expenseCategories.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.expenseCategories.map((cat, index) => (
                  <div
                    key={index}
                    className="p-2 bg-yellow-50 rounded flex justify-between"
                  >
                    <span className="text-sm text-gray-800">{cat}</span>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("expenseCategories", index)
                      }
                      className="text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={isEditModalOpen}
        activity={editingActivity}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingActivity(null);
        }}
        onSuccess={handleEditSuccess}
        loading={loading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Activity"
        message="Are you sure you want to delete this activity?"
        isDangerous
        loading={loading}
        onConfirm={handleDeleteActivity}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default Activities;
