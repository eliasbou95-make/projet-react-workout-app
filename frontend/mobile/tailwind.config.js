/** @type {import('tailwindcss').Config} */
module.exports = {
  // Où Tailwind doit chercher tes classes className="..."
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A', // fond principal — noir carbone profond
        card: '#18181B', // cartes / blocs — carbone légèrement plus clair
        foreground: '#FAFAFA', // texte principal (presque blanc)
        muted: '#8E8E93', // texte discret (gris carbone)
        accent: '#44D62C', // vert énergique — boutons, actifs, accents
      },
    },
  },
  plugins: [],
};
