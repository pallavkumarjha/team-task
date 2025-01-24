// import "@/app/globals.css"
import './globals.css'
import { Inter } from "next/font/google"
import Provider from "../providers/SessionProvider";
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Snap Note",
  description: "A shared board for team members and quick requests",
}

export default function RootLayout({
  children
}) {
  return (
    (<html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Provider>
          {children}
          <Footer />
        </Provider>
      </body>
    </html>)
  );
}

