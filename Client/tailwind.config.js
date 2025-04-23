/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JS/TS/JSX/TSX files in src
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        divider: "var(--divider)",
        "slate-800": "var(--slate-800)",
        "slate-900": "var(--slate-900)",
        "slate-50": "var(--slate-50)",
        success: "var(--success)",
        warning: "var(--warning)",
        info: "var(--info)",
      },
    },
  },
  plugins: [],
};
