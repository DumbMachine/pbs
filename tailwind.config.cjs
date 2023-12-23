import colors from "tailwindcss/colors";

module.exports = {
  prefix: "tw-",
  // important: "#shorty-app",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      colors: {
        primary: colors.slate[800],
        secondary: colors.slate[600],
        accent: colors.yellow[600],
      },
      textColor: {
        primary: "text-white",
        secondary: "text-gray-200",
      },
    },
  },
  purge: {
    enabled: true,
    content: ["./src/**/*.{html,ts,tsx}"],
  },
  plugins: [],
  corePlugins: {
    preflight: true,
    // // chrome might require it false
    // preflight: false,
  },
};
