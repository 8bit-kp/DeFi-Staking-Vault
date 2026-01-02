import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DeFi Staking Vault | Earn Rewards on Your Crypto",
  description: "Stake your tokens and earn passive rewards with our secure and transparent DeFi staking protocol. Built with Solidity and Next.js.",
  keywords: ["DeFi", "staking", "crypto", "blockchain", "ethereum", "sepolia", "rewards", "passive income"],
  authors: [{ name: "DeFi Staking Vault" }],
  openGraph: {
    title: "DeFi Staking Vault",
    description: "Stake your tokens and earn passive rewards",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
