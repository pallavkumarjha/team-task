import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Team Task",
  description: "A shared board for team members and quick requests",
}

export default function RootLayout({
  children
}) {
  return (
    (<html lang="en">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>)
  );
}

