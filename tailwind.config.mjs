/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', // Penting buat fitur dark mode
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Plus Jakarta Sans', 'sans-serif'],
				hand: ['Patrick Hand', 'cursive'],
			},
			colors: {
				paper: '#FDFCF6',
				ink: '#2D2D2D',
				accent: '#F4D03F',
				dark: {
					bg: '#18181B',
					card: '#27272A',
					text: '#E4E4E7'
				}
			},
			typography: (theme) => ({
				// Konfigurasi typography plugin (kalau lu pake @tailwindcss/typography)
				DEFAULT: {
					css: {
						color: theme('colors.ink'),
						h1: { fontFamily: theme('fontFamily.display') },
						h2: { fontFamily: theme('fontFamily.display') },
						h3: { fontFamily: theme('fontFamily.display') },
					}
				}
			})
		},
	},
	plugins: [
		require('@tailwindcss/typography'), // Pastiin install ini: npm install -D @tailwindcss/typography
	],
}