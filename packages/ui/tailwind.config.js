/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./tailwind/**/*.{tsx,jsx,ts,js}",
    "../../apps/*/**.{tsx,jsx,ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#5237F3",
        accent: "#7976FF",
        text: "#E8E8F4",
        grey: "#3C3C40",
        negative: "#D73C37",
        disabled: "#666668",
        bg: "#111113",
        /*
        videoBackgroundGradient:
          "linear-gradient(160.68deg, rgba(82, 55, 243, 0.28) 2.04%, rgba(0, 0, 0, 0) 87.02%), rgba(0,0,2,.4)",
        backgroundGradient:
          "linear-gradient(163.02deg, #111113 58.37%, rgba(82, 55, 243, 0.17) 97.01%)",
        headingGradient:
          "linear-gradient(160.26deg, #5237F3 46.37%, #E8E8F4 84.22%, #5237F3 154.83%)",
        primaryButtonGradient:
          "linear-gradient(294.47deg, #5237F3 9.25%, rgba(82, 55, 243, 0) 64.17%)",
        toastBackgroundPurple:
          "linear-gradient(294.47deg, #5237F3 9.25%, #000000 64.17%)",
        toastShadowPurple: "#5237F3",
        toastBackgroundYellow:
          "linear-gradient(294.47deg, rgba(243, 179, 55, 0.47) 9.25%, #000000 64.17%), #000000",
        toastYellow: "#F3B337",
				*/
      },
    },
  },
  plugins: [],
};
