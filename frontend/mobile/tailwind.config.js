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
      // Ton thème : sombre + accent vert. Utilisables comme bg-background, text-accent...
      colors: {
        background: '#0F172A', // fond principal (slate-900)
        card: '#1E293B', // cartes / blocs (slate-800)
        foreground: '#F1F5F9', // texte principal (presque blanc)
        muted: '#94A3B8', // texte discret (gris)
        accent: '#22C55E', // couleur d'accent (vert vif) — boutons, actifs
      },
    },
  },
  plugins: [],
};
