import api from './api';
import emailjs from '@emailjs/browser';

// Access environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const contactService = {
  // Get contact info (Phone/Address) from your backend database
  getContactInfo: async () => {
    try {
      const response = await api.get('/contact');
      return response.data;
    } catch (error) {
      console.error("Error fetching contact info:", error);
      throw error;
    }
  },

  // Send email via Frontend (EmailJS) with concatenated message
  sendMessage: async (formData) => {
    try {
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.error("EmailJS environment variables are missing!");
        return { success: false, message: "System configuration error." };
      }

      // 1. Create a formatted string with all the info
      const formattedMessage = `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
      `;

      // 2. Prepare parameters to match your EmailJS Template variables
      // Assuming your template has {{message}}, {{user_name}}, {{user_email}}, {{subject}}
      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        subject: formData.subject,
        message: formattedMessage, // <-- sending the full combined text here
      };

      // 3. Use 'send' instead of 'sendForm' for custom data
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      
      if (result.status === 200) {
        return { success: true, message: "Message sent successfully!" };
      }
      return { success: false, message: "Failed to send message." };
    } catch (error) {
      console.error("EmailJS Error:", error);
      throw error;
    }
  }
};