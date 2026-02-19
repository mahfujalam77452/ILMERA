/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        danger: "#ef4444",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      transitionProperty: {
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
