export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  CATEGORIES: "/categories",
  PICTURES: "/pictures",
  VIDEOS: "/videos",
  ACTIVITIES: "/activities",
  BLOGS: "/blogs",
  VOLUNTEER_REQUESTS: "/volunteer-requests",
  VOLUNTEER_LIST: "/volunteer-list",
  CONTACTS: "/contacts",
  DONATIONS: "/donations",
  APPEALS: "/appeals",
  CURRENT_PROJECT: "/current-project",
};

export const MESSAGES = {
  SUCCESS: {
    ADDED: "Added successfully!",
    UPDATED: "Updated successfully!",
    DELETED: "Deleted successfully!",
    PASSWORD_CHANGED: "Password changed successfully!",
    LOGGED_OUT: "Logged out successfully!",
  },
  ERROR: {
    SOMETHING_WRONG: "Something went wrong. Please try again!",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMPTY_FIELDS: "Please fill all required fields",
    INVALID_FILE: "Invalid file. Please upload a valid image (max 10MB)",
    INVALID_URL: "Please enter a valid URL",
  },
  CONFIRM: {
    DELETE: "Are you sure you want to delete this item?",
    LOGOUT: "Are you sure you want to logout?",
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_FORMATS: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

export const API_TIMEOUT = 30000;
