import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@marraph/daisy/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    colors: {
      "black": "#0F0E0E",
      "gray": "#A5A5A5",
      "white": "#EEEEEE",
      "selected": "#222121",
      "placeholder": "#7B7777",
      "dark": "#222121",
      "blue": "#2622F6",
      "lightblue": "#3633FD",
      "lightred": "#F55050",
      "selectwhite": "#CCCBCB",
      "purple": "#ac65bf",
      "success": "#439C3B",
      "warning": "#F2CF19",
      "error": "#C51919",

      "topicblue": "#5752EB",
      "topicred": "#ED4C4C",
      "topicgreen": "#119c21",
      "topicyellow": "#EDE240",
      "topicpurple": "#ab14b3",

      "calBlue": "#4D76DF",
      "calGreen": "#5FCF56",
      "calPurple": "#A151D2",
      "calPink": "#D251C5",
      "calYellow": "#DDDF4D",
    },
    extend: {
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "mono": ["Inconsolata", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [

  ],
};
export default config;
