import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Light Holiday Theme - High Contrast
                "bg-primary": "#FFF8FF",       // Soft lavender-white base
                "bg-card": "#FFFFFF",
                "bg-secondary": "#F5E6FF",
                "text-primary": "#3D0B47",     // Deep purple high contrast
                "text-secondary": "#6B2A7A",
                "accent-pink": "#FF69B4",
                "accent-purple": "#9B59B6",
                "holiday-red": "#E63946",
                "holiday-green": "#2A9D8F",
                "gold": "#E9C46A",
                "border-light": "#E0C3FC",
                // Legacy support
                "pink-primary": "#FF69B4",
                "purple-primary": "#9B59B6",
                "hot-pink": "#FF1493",
                "lavender-bg": "#F8F0FF",
                "deep-purple-text": "#3D0B47",
            },
            backgroundImage: {
                "gradient-holiday": "linear-gradient(135deg, #FF69B4 0%, #9B59B6 50%, #E63946 100%)",
                "gradient-primary": "linear-gradient(135deg, #FF69B4 0%, #9B59B6 100%)",
            },
            fontFamily: {
                sans: ["var(--font-poppins)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
