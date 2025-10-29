/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandtext: "#444F55",
        brandprimary: "#D62828",
        brandsecondary: "#E0E3E4",
        brandaccent: "#F8F9FA",
        brandhighlight: "#1B4965",
      },
    },
  },
  plugins: [],
};
