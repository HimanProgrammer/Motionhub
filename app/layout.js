import "./globals.css";

export const metadata = {
  title: "MotionHub — Prompts that build motion & Claude‑coded websites",
  description:
    "A premium library of AI prompts that build stunning animated motion websites and full coded sites through Claude. Copy, paste, launch.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
