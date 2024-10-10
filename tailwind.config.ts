import { Config } from 'tailwindcss/types/config';
import { Utilities } from './tailwind-theme/utilities';

export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        'primary': '#4f46e5'
      }
    },
  },
  plugins: [Utilities],
} as Config;
