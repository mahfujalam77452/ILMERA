export const validations = {
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPassword: (password) => {
    // Minimum 6 characters
    return password && password.length >= 6;
  },

  isNotEmpty: (value) => {
    if (typeof value === "string") return value.trim().length > 0;
    return !!value;
  },

  isValidFile: (
    file,
    maxSizeMB = 10,
    allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ) => {
    if (!file) return false;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) return false;

    return allowedFormats.includes(file.type);
  },

  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  getErrors: (validationMap) => {
    const errors = {};
    Object.keys(validationMap).forEach((field) => {
      if (!validationMap[field].isValid) {
        errors[field] = validationMap[field].message;
      }
    });
    return errors;
  },
};

export const sanitizeInput = (input) => {
  return input.trim();
};
