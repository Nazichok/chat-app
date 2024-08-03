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

    },
  },
  plugins: [Utilities],
};
