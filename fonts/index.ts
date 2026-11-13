import localFont from "next/font/local";

export const myFont = localFont({
  src: "./MA1_heavy-30-2.0.otf",
  variable: "--MA1", // CSSで使う名前
  display: "swap",
});