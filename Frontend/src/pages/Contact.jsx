import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { contactService } from '../services/contactService';

const Contact = () => {
  const { t } = useTranslation();
  
  // Data State
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  
  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // 1. Fetch Contact Info on Mount
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await contactService.getContactInfo();
        if (res.success) {
          setContactInfo(res.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load contact info");
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchContact();
  }, []);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Real Submission via EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pass the formData object directly to the service
      const res = await contactService.sendMessage(formData);
      
      if (res.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear Form
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styling Constants
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass = "w-full px-3 py-2.5 rounded-md border border-gray-300 text-gray-900 text-sm focus:ring-1 focus:ring-[#0B4D26] focus:border-[#0B4D26] outline-none transition-all placeholder-gray-400";

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16 pt-20">
      
      {/* Banner */}
      <div className="bg-[#0B4D26] py-12 px-4 text-center mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {t('contact_page.title')}
        </h1>
        <p className="text-green-100 text-sm md:text-base font-medium">
          <Link to="/" className="hover:text-white transition-colors">{t('menu.home')}</Link> 
          <span className="mx-2">/</span> 
          {t('contact_page.title')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: Contact Form */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
              {t('contact_page.title')} Form
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className={labelClass}>
                  {t('contact_page.form_name')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  required 
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className={labelClass}>
                  {t('contact_page.form_email')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  required 
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className={labelClass}>
                  {t('contact_page.form_subject')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  required 
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className={labelClass}>
                  {t('contact_page.form_message')} <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4" 
                  className={inputClass}
                  required
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full cursor-pointer font-bold py-3 rounded-md shadow-sm text-sm uppercase tracking-wide transition-colors ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed text-gray-100" 
                    : "bg-[#0B4D26] text-white hover:bg-[#093d1e]"
                }`}
              >
                {isSubmitting ? "Sending..." : t('contact_page.btn_send')}
              </button>
            </form>
          </div>

          {/* RIGHT: Dynamic Info */}
          <div className="flex flex-col space-y-4">
            
            {loadingInfo ? (
              <div className="text-gray-500 text-center py-10 text-sm">Loading contact info...</div>
            ) : contactInfo ? (
              <>
                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#0B4D26] group-hover:bg-[#0B4D26] group-hover:text-white transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">{t('contact_page.info_phone')}</h3>
                    <p className="text-gray-800 font-semibold font-mono text-sm">{contactInfo.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#0B4D26] group-hover:bg-[#0B4D26] group-hover:text-white transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">{t('contact_page.info_address')}</h3>
                    <p className="text-gray-800 font-medium text-sm">{contactInfo.location}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#0B4D26] group-hover:bg-[#0B4D26] group-hover:text-white transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">{t('contact_page.info_email')}</h3>
                    <p className="text-gray-800 font-medium text-sm">{contactInfo.email}</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">
                    {t('contact_page.info_social') || "Follow Us"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {contactInfo.facebook && (
                      <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#1877F2]/10 text-[#1877F2] rounded-md hover:bg-[#1877F2] hover:text-white transition-all text-xs font-bold">
                        Facebook
                      </a>
                    )}
                    {contactInfo.youtube && (
                      <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#FF0000]/10 text-[#FF0000] rounded-md hover:bg-[#FF0000] hover:text-white transition-all text-xs font-bold">
                        YouTube
                      </a>
                    )}
                    {contactInfo.linkedin && (
                      <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-md hover:bg-[#0A66C2] hover:text-white transition-all text-xs font-bold">
                        LinkedIn
                      </a>
                    )}
                    {contactInfo.whatsapp && (
                      <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#25D366]/10 text-[#25D366] rounded-md hover:bg-[#25D366] hover:text-white transition-all text-xs font-bold">
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-red-500 text-sm">Failed to load contact info.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;