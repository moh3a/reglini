module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/config/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media'
  theme: {
    typography: (theme) => ({}),
    extend: {
      colors: {
        facebook: "#1876f2",
        aliexpress: "#ff4747",
        grim: "#1b1f23",
        success: "#16a34a",
        danger: "#ed3737",
        warning: "#eab308",
        lightTransparent: "rgb(0 0 0 / 0.05)",
        darkTransparent: "rgb(0 0 0 / 0.5)",
      },
      zIndex: {
        100: 100,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
