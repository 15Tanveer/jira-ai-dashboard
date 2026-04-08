import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-900/70">
          <nav className="mx-auto flex max-w-6xl gap-6 px-6 py-4 text-sm">
            <Link href="/">Dashboard</Link>
            <Link href="/chat">AI Chat</Link>
            <Link href="/assignees">Assignees</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
