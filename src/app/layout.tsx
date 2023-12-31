import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import { NotesProvider } from "@/context/NoteContext";
import { GlobalProvider } from "@/context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Limetask",
  description: "Project Managment App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-cream">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <GlobalProvider>
            <NotesProvider>
              <div className="flex flex-col h-screen w-full pt-[18px] pb-9 px-8 overflow-scroll">
                {children}
              </div>
            </NotesProvider>
          </GlobalProvider>
        </div>
      </body>
    </html>
  );
}
