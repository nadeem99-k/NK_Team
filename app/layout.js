import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Aura | Premium Tools",
  description: "Advanced social engineering templates and link generation platform.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
        <Navbar />
        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
