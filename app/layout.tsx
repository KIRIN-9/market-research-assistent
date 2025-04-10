import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/sidebar-provider";
import { StorageInitializer } from "@/components/storage-initializer";
import "@/app/globals.css";

export const metadata = {
  title: "MarketSense AI",
  description: "AI-powered market research assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider>
            <StorageInitializer />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
