// Simple HTML sanitizer to prevent XSS attacks
// Allows basic formatting and links but removes scripts and dangerous content
export const sanitizeHtml = (html) => {
  if (!html) return "";

  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Remove script tags and event handlers
  const scripts = temp.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  // Remove event handlers from elements
  const allElements = temp.querySelectorAll("*");
  allElements.forEach((el) => {
    // Remove all on* attributes
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    });

    // Sanitize specific elements
    if (el.tagName.toLowerCase() === "a") {
      // Only allow http, https, mailto, and relative links
      const href = el.getAttribute("href");
      if (href && !href.match(/^(https?:|mailto:|\/|\.)/i)) {
        el.removeAttribute("href");
      }
    }
  });

  return temp.innerHTML;
};
