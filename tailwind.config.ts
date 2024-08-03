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
      "black": "#090909",
      "black-light": "#111111",
      "dark": "#171717",
      "dark-light": "#1C1C1C",
      "edge": "#363636",
      "marcador": "#878787",
      "gray": "#A6A6A6",
      "white": "#ECECEC",
      "white-dark": "#C7C7C7",
      "lavender": "#8855BB",
      "lavender-light": "#967BB6",

      "lightred": "#F55050",
      "success": "#439C3B",
      "warning": "#F2CF19",
      "error": "#C51919",

      "topicblue": "#5752EB",
      "topicred": "#ED4C4C",
      "topicgreen": "#328f32",
      "topicyellow": "#EDE240",
      "topicpurple": "#793ec2",
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
