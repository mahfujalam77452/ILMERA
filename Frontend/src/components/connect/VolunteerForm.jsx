import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { volunteerService } from "../../services/volunteerService";
import CountrySelect from "./CountrySelect"; // <- Import the new component

/* ---------------- Input Component ---------------- */
const Input = ({ name, label, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B4D26] focus:border-[#0B4D26] outline-none transition"
    />
  </div>
);

/* ---------------- TextArea Component ---------------- */
const TextArea = ({ name, label, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={4}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B4D26] focus:border-[#0B4D26] outline-none transition resize-none"
    />
  </div>
);

/* ---------------- Main Component ---------------- */
const VolunteerForm = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [picture, setPicture] = useState(null);

  const initialState = {
    name: "",
    email: "",
    country: "",
    description: "",
    why: "",
    motivation: "",
    expectation: "",
    is_member: false,
  };

  const [formData, setFormData] = useState(initialState);

  /* -------- Handle Change -------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------- Handle Image -------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning(t("connect_page.fields.picture"));
      return;
    }

    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  /* -------- Submit -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!picture) {
        toast.error(t("connect_page.fields.picture"));
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("image", picture);

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await volunteerService.register(data);

      if (response.success) {
        toast.success( t("connect_page.success_msg") || response.message );

        setFormData(initialState);
        setPicture(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("connect_page.error_msg")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-8 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-[#0B4D26] text-center">
        {t("connect_page.title")}
      </h2>

      {/* Image Upload */}
      <div className="text-center">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          {t("connect_page.fields.picture")} *
        </label>

        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border border-gray-300 mb-4">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Upload
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-6 py-2 border border-[#0B4D26] text-[#0B4D26] rounded-lg hover:bg-green-50 transition"
        >
          {t("connect_page.upload_btn")}
        </button>
      </div>

      {/* Personal Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          label={t("connect_page.fields.name")}
          required
        />
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          label={t("connect_page.fields.email")}
          required
        />
      </div>

      {/* Country Select Component */}
      <CountrySelect formData={formData} setFormData={setFormData} />

      {/* Volunteer Questions */}
      <TextArea
        name="description"
        value={formData.description}
        onChange={handleChange}
        label={t("connect_page.fields.description")}
        required
      />
      <TextArea
        name="why"
        value={formData.why}
        onChange={handleChange}
        label={t("connect_page.fields.why")}
        required
      />
      <TextArea
        name="motivation"
        value={formData.motivation}
        onChange={handleChange}
        label={t("connect_page.fields.motivation")}
        required
      />
      <TextArea
        name="expectation"
        value={formData.expectation}
        onChange={handleChange}
        label={t("connect_page.fields.expectation")}
        required
      />

    

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0B4D26] text-white py-4 rounded-lg font-bold hover:bg-[#093d1e] transition disabled:opacity-50"
      >
        {loading ? t("connect_page.loading") : t("connect_page.btn_submit")}
      </button>
    </form>
  );
};

export default VolunteerForm;
