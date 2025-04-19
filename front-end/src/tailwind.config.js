/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Garanta que Tailwind escaneia seus arquivos React
    ],
    theme: {
      extend: {}, // Permite adicionar customizações de tema, se necessário
    },
    plugins: [], // Adicione plugins se precisar (opcional)
  };
  