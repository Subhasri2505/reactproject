/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6366f1',
                accent: '#ec4899',
                secondary: '#3b82f6',
            },
            backgroundImage: {
                'vibrant-gradient': 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                'hero-gradient': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            }
        },
    },
    plugins: [],
}
