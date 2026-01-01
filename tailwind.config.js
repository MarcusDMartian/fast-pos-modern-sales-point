/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '375px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            fontFamily: {
                sans: ['Manrope', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Primary - Dark Blue
                primary: {
                    50: '#f0f3f9',
                    100: '#dce3f2',
                    200: '#b9c7e5',
                    300: '#8da5d5',
                    400: '#6583c5',
                    500: '#4766ab',
                    600: '#364C84',
                    700: '#2d3f6d',
                    800: '#243356',
                    900: '#1b273f',
                    950: '#111829',
                    DEFAULT: '#364C84',
                },
                // Secondary - Light Blue
                secondary: {
                    50: '#f5f8fe',
                    100: '#e9effc',
                    200: '#d5e1f9',
                    300: '#b8cef4',
                    400: '#95B1EE',
                    500: '#7394e3',
                    600: '#5a78d4',
                    700: '#4862bc',
                    800: '#3d5199',
                    900: '#344578',
                    950: '#232d4a',
                    DEFAULT: '#95B1EE',
                },
                // Accent - Light Green
                accent: {
                    50: '#fcfef4',
                    100: '#f8fce5',
                    200: '#f0f8cc',
                    300: '#E7F1A8',
                    400: '#d5e67a',
                    500: '#c0d654',
                    600: '#a5bc3a',
                    700: '#7f922d',
                    800: '#667428',
                    900: '#556124',
                    950: '#2d3510',
                    DEFAULT: '#E7F1A8',
                },
                // App background - Warm off-white
                app: '#FFFDF5',
                // Legacy glow (updated for new primary)
                'primary-glow': 'rgba(54, 76, 132, 0.15)',
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            }
        },
    },
    plugins: [],
}
