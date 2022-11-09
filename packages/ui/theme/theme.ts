//

import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  theme: {
    colors: {
      brand: "#5237F3",
      accent: "#7976FF",
      "accent-translucent": "rgba(82, 55, 243, 0.5)",
      text: "#E8E8F4",
      grey: "#3C3C40",
      negative: "#D73C37",
      disabled: "#99999F",
      background: "#111113",
      videoBackgroundGradient:
        "linear-gradient(160.68deg, rgba(82, 55, 243, 0.28) 2.04%, rgba(0, 0, 0, 0) 87.02%), #111113",
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
    },

    space: {
      "2xs": "0.25rem", //4px
      xs: "0.5rem", //8px
      sm: "1rem", //16px
      md: "1.25rem", //20px
      lg: "2rem", //32px
      xl: "2.25rem", //36px
      "2xl": "2.5rem", //40px
      "3xl": "2.875rem", //46px
    },
    sizes: {
      "4xs": "0.25rem", //4px
      "3xs": "0.375rem", //6px
      "2xs": "0.5rem", //8px
      xs: "0.75rem", //12px
      sm: "1rem", //16px
      md: "1.25rem", //20px
      lg: "2rem", //32px
      xl: "2.25rem", //36px
      "2xl": "2.5rem", //40px
      "3xl": "2.875rem", //46px
    },
    fontSizes: {
      "3xs": "0.5rem", //8px
      "2xs": "0.8rem", //12px
      xs: "1rem", //16px
      sm: "1.25rem", //20px
      md: "1.5rem", //24px
      lg: "2rem", //32px
      xl: "2.25rem", //36px
      "2xl": "3rem", //48px
      "3xl": "4rem", //64px
    },
    fonts: {
      rubik: "Rubik, apple-system, sans-serif",
    },
    fontWeights: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },

    radii: {
      xs: "3px",
    },
    lineHeights: {},
    letterSpacings: {},
    borderWidths: {},
    borderStyles: {},
    shadows: {
      toastPurple: "0px 0px 15px #5237F3",
      toastYellow: "0px 0px 15px #F3B337",
    },
    zIndices: {},
    transitions: {},
  },
  media: {
    base: "(min-width: 0px)",
    xs: "(min-width: 375px)",
    sm: "(min-width: 600px)",
    md: "(min-width: 801px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1200px)",
    mobile: "(min-width: 600px)",
  },
});
