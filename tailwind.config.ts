import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'cream': '#F6F6F4',
        'custom-black': '#171717',
        'custom-second-black': '#232323',
        'custom-deep-black': '#131313',
        'custom-gray': '#2A2B2B',
        'custom-bg-gray': '#1E1F1F'
      },
      boxShadow: {
        'custom-inner': 'inset 0px 0px 10px 0px rgba(45,82,33,1);',
        'custom-lime': '0px 0px 10px 4px rgba(45,82,33,1);'
      },
      screens: {
        '3xl': '1730',
        '4xl': '1900'
      }
    },
  },
  plugins: [],
}
export default config
