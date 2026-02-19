import { sendSuccess, sendError } from "../utils/response.js";
import Contact from "../models/Contact.js";

export const updateContact = async (req, res) => {
  try {
    const { phone, location, email, facebook, youtube, linkedin, whatsapp } =
      req.body;

    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        phone,
        location,
        email,
        facebook,
        youtube,
        linkedin,
        whatsapp,
      });
    } else {
      Object.assign(contact, {
        phone: phone || contact.phone,
        location: location || contact.location,
        email: email || contact.email,
        facebook: facebook || contact.facebook,
        youtube: youtube || contact.youtube,
        linkedin: linkedin || contact.linkedin,
        whatsapp: whatsapp || contact.whatsapp,
      });
      await contact.save();
    }

    sendSuccess(res, contact, "Contact updated successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({});
    }

    sendSuccess(res, contact, "Contact retrieved successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  updateContact,
  getContact,
};
