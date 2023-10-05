import t from "ui/tailwind.config";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "../control/src/*.{js,ts,jsx,tsx}",
    "../../packages/ui/tailwind/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...t.theme,
  },
  plugins: [],
};
