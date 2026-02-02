
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}', // include HeroUI components
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}', // include HeroUI theme
    ],
    theme: {
        extend: {},
    },
    darkMode: 'class',
    plugins: [],
}

export default config
