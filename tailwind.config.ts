import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontSize: {
  			'2xs': '10px',
  			'3xs': '9px'
  		},
  		fontWeight: {
  			'100': '100',
  			'200': '200',
  			'300': '300',
  			'400': '400',
  			'600': '600',
  			'500': '500',
  			'700': '700',
  			'800': '800',
  			'900': '900'
  		},
  		fontFamily: {
  			monument: [
  				'Monument, sans-serif'
  			]
  		},
  		colors: {
  			black: '#070707',
  			success: '#15FFAB',
  			gold: {
				100: "#FFE8C7",
				200: "#B9A070",
  			},
  			red: {
  				'100': '#E1261FFF'
  			},
  			green: {
  				'100': '#31B337FF'
  			},
  			gray: {
  				'100': '#EBE9ED',
  				'200': '#C8C7CE',
  				'300': '#9B9B9B',
  				'400': '#9A9A9A',
  				'500': '#8A8A8A',
  				'600': '#6B6969',
  				'700': '#1F1F1F',
  				'800': '#1A1A1A',
  				'900': '#0F0F0F'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
