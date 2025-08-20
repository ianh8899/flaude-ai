/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-orange": "rgb(217, 119, 87)",
        "custom-grey": "rgb(250, 249, 245);",
        "background-grey": "rgb(38, 38, 36)",
        "chat-grey": "rgb(20, 20, 19)",
        accent: "rgb(217, 119, 87)",
        // or use hex instead
        brand: "#d97757",
      },
    },
  },
  plugins: [],
};
