import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			screens: {
				"x": "375px",
				"xs": "425px",
				"xl": "1280px",
				"2xl": "1440px",
			},
			colors: {
				"white-1": "#F8F8F8",
				"grey-1": "#616161",
				"grey-2": "#E5E7EB",
				"blue-1": "#005EBE",
				"blue-2": "#E9F5FE",
				"blue-3": "#F5F7F9",
				"red-1": "#FF0000",
				"gold-border": "rgba(180, 123, 43, 0.3)",
				"error": "#800501",
				"gold-text": "rgba(180, 123, 43, 1)",
				"gray-light": "rgba(102, 113, 133, 1)",
				'dark-blue': 'rgba(16, 25, 40, 1)',
			},
			backgroundColor: {
				"sign-in-layer": "rgba(30, 30, 30, 0.4)",
			},
			backgroundImage: {
				"btn-gold": "linear-gradient(90deg, #DDA627 0%, #B47B2B 0.01%)",
			},
			fontFamily: {
				"libre-franklin": ['"Libre Franklin", sans-serif'],
				"inter": ['"Inter", sans-serif'],
			},
			fontSize: {
				"heading1-bold": [
					"50px",
					{
						lineHeight: "100%",
						fontWeight: "700",
					},
				],
				"heading2-bold": [
					"30px",
					{
						lineHeight: "100%",
						fontWeight: "700",
					},
				],
				"heading3-bold": [
					"24px",
					{
						lineHeight: "100%",
						fontWeight: "700",
					},
				],
				"heading4-bold": [
					"20px",
					{
						lineHeight: "100%",
						fontWeight: "700",
					},
				],
				"body-bold": [
					"18px",
					{
						lineHeight: "100%",
						fontWeight: "700",
					},
				],
				"body-semibold": [
					"18px",
					{
						lineHeight: "100%",
						fontWeight: "600",
					},
				],
				"body-medium": [
					"18px",
					{
						lineHeight: "100%",
						fontWeight: "500",
					},
				],
				"base-bold": [
					"16px",
					{
						lineHeight: "100%",
						fontWeight: "600",
					},
				],
				"base-medium": [
					"16px",
					{
						lineHeight: "100%",
						fontWeight: "500",
					},
				],
			},
			boxShadow: {
        'custom': '0px 4px 20px 0px #AAA9B8/10',
      },
		},
	},
	plugins: [tailwindAnimate],
} satisfies Config
export default config;
