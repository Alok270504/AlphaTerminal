import "./globals.css";

export const metadata = { title: "QuantLab", description: "Quant Workbench" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
