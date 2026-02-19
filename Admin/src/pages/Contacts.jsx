import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { contactService } from "../services";

const Contacts = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await contactService.get();
      setContact(response.data);
      setFormData(response.data);
    } catch (error) {
      toast.error("Failed to fetch contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await contactService.update(formData);
      toast.success("Contact information updated successfully!");
      setContact(formData);
      setEditing(false);
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update contact";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(contact);
    setEditing(false);
  };

  if (loading && !contact) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="Contact Information" />

      <Card className="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="+880 1234 567 890"
            disabled={!editing}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            placeholder="contact@ilmera.com"
            disabled={!editing}
          />

          <Input
            label="Location"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
            placeholder="Dhaka, Bangladesh"
            disabled={!editing}
          />

          <Input
            label="Facebook"
            name="facebook"
            type="url"
            value={formData.facebook || ""}
            onChange={handleInputChange}
            placeholder="https://facebook.com/ilmera"
            disabled={!editing}
          />

          <Input
            label="YouTube"
            name="youtube"
            type="url"
            value={formData.youtube || ""}
            onChange={handleInputChange}
            placeholder="https://youtube.com/@ilmera"
            disabled={!editing}
          />

          <Input
            label="LinkedIn"
            name="linkedin"
            type="url"
            value={formData.linkedin || ""}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/company/ilmera"
            disabled={!editing}
          />

          <Input
            label="WhatsApp"
            name="whatsapp"
            value={formData.whatsapp || ""}
            onChange={handleInputChange}
            placeholder="+880 1234 567 890"
            disabled={!editing}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {!editing ? (
              <Button variant="primary" onClick={() => setEditing(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>

      {/* Info Message */}
      <Card className="mt-6 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ Info:</span> Update the contact
          information that will be displayed on your website. All fields are
          optional.
        </p>
      </Card>
    </AdminLayout>
  );
};

export default Contacts;
