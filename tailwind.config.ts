import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        "panel-2": "var(--panel-2)",
        line: "var(--line)",
        text: "var(--text)",
        "text-dim": "var(--text-dim)",
        accent: "var(--accent)",
        pass: "var(--pass)",
        fail: "var(--fail)",
        "white-belt": "var(--white-belt)",
        "yellow-belt": "var(--yellow-belt)",
        "orange-belt": "var(--orange-belt)",
        "green-belt": "var(--green-belt)",
        "blue-belt": "var(--blue-belt)",
        "brown-belt": "var(--brown-belt)",
        "black-belt": "var(--black-belt)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
