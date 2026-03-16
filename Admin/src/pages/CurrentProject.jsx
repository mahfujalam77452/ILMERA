import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import RichTextEditor from "../components/common/RichTextEditor";
import { currentProjectService } from "../services";
import { validations } from "../utils/validations";

const CurrentProject = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    selectedImage: null,
    currentImage: null,
    titleEn: "",
    titleBn: "",
    sections: [],
    sectionType: "heading",
    sectionContentEn: "",
    sectionContentBn: "",
    sectionOrder: 1,
  });

  useEffect(() => {
    fetchCurrentProject();
  }, []);

  const fetchCurrentProject = async () => {
    try {
      setLoading(true);
      const response = await currentProjectService.get();
      const project = response.data || response;

      if (project && project._id) {
        setFormData({
          selectedImage: null,
          currentImage: project.image,
          titleEn: project.title?.en || "",
          titleBn: project.title?.bn || "",
          sections: project.sections || [],
          sectionType: "heading",
          sectionContentEn: "",
          sectionContentBn: "",
          sectionOrder: (project.sections?.length || 0) + 1,
        });
      } else {
        toast.info("No current project found. Create one to get started!");
      }
    } catch (error) {
      toast.error("Failed to fetch current project");
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
    if (!formData.selectedImage && !formData.currentImage) {
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

  const handleSaveProject = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
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

      await currentProjectService.update(formDataObj);
      toast.success("Current project updated successfully!");
      setIsEditing(false);
      await fetchCurrentProject();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to save project";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading current project..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Current Project"
        subtitle="Manage the organization's current focus project"
        actions={
          !isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Project
            </Button>
          )
        }
      />

      {!isEditing ? (
        // View Mode
        formData.titleEn ? (
          <Card>
            {formData.currentImage && (
              <img
                src={formData.currentImage}
                alt={formData.titleEn}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}

            <h2 className="section-title">{formData.titleEn}</h2>
            <p className="text-gray-600 mb-6">{formData.titleBn}</p>

            <div className="space-y-6">
              {formData.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="subsection-title capitalize">
                    {section.type}
                  </h3>
                  <p className="text-gray-700">{section.content.en}</p>
                  <p className="text-gray-700 mt-2">{section.content.bn}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-center text-gray-500">
              No current project set. Click "Edit Project" to create one.
            </p>
          </Card>
        )
      ) : (
        // Edit Mode
        <Card>
          <form onSubmit={handleSaveProject} className="space-y-6">
            {/* Image Section */}
            <div>
              <h3 className="subsection-title">Project Image</h3>

              {formData.currentImage && !formData.selectedImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={formData.currentImage}
                    alt="Current project"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {formData.selectedImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">New Image:</p>
                  <img
                    src={URL.createObjectURL(formData.selectedImage)}
                    alt="New project"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="input-field"
              />
              {formData.selectedImage && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ {formData.selectedImage.name}
                </p>
              )}
            </div>

            {/* Bilingual Title */}
            <div>
              <h3 className="subsection-title">Project Title</h3>
              <div className="space-y-4">
                <Input
                  label="English Title"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  placeholder="Enter project title in English"
                  required
                />

                <Input
                  label="Bengali Title"
                  value={formData.titleBn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleBn: e.target.value })
                  }
                  placeholder="বাংলায় প্রকল্পের শিরোনাম লিখুন"
                  required
                />
              </div>
            </div>

            {/* Sections */}
            <div>
              <h3 className="subsection-title">Content Sections</h3>

              {/* Add Section Form */}
              <Card className="bg-gray-50 mb-4">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Add Section
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="form-label">Section Type</label>
                    <select
                      value={formData.sectionType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sectionType: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="heading">Heading</option>
                      <option value="paragraph">Paragraph</option>
                      <option value="highlight">Highlight</option>
                      <option value="quote">Quote</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Content (English)</label>
                    <RichTextEditor
                      value={formData.sectionContentEn}
                      onChange={(content) =>
                        setFormData({
                          ...formData,
                          sectionContentEn: content,
                        })
                      }
                      placeholder="Enter content in English with formatting and links..."
                    />
                  </div>

                  <div>
                    <label className="form-label">Content (Bengali)</label>
                    <RichTextEditor
                      value={formData.sectionContentBn}
                      onChange={(content) =>
                        setFormData({
                          ...formData,
                          sectionContentBn: content,
                        })
                      }
                      placeholder="বাংলায় কন্টেন্ট লিখুন ফরম্যাটিং এবং লিঙ্ক সহ..."
                    />
                  </div>

                  <Button
                    variant="secondary"
                    onClick={addSection}
                    type="button"
                  >
                    Add Section
                  </Button>
                </div>
              </Card>

              {/* Sections List */}
              {formData.sections.length > 0 && (
                <div className="space-y-3">
                  <p className="font-medium text-gray-900">
                    Sections ({formData.sections.length})
                  </p>
                  {formData.sections.map((section, index) => (
                    <Card key={index} className="bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {section.type}
                          </p>
                          <div
                            className="text-sm text-gray-700 mt-2 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: section.content.en
                                .substring(0, 150)
                                .concat(
                                  section.content.en.length > 150 ? "..." : "",
                                ),
                            }}
                          />
                        </div>
                        <button
                          onClick={() => removeSection(index)}
                          className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Project"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => {
                  setIsEditing(false);
                  fetchCurrentProject();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </AdminLayout>
  );
};

export default CurrentProject;
