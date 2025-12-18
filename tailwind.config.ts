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
                "pink-primary": "#FF69B4",
                "purple-primary": "#9B59B6",
                "hot-pink": "#FF1493",
                "lavender-bg": "#F8F0FF",
                "deep-purple-text": "#4A0E4E",
            },
            backgroundImage: {
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
