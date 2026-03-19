import { Exo_2, Orbitron } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { bem } from "@/lib/bem";
import "./globals.css";
const exo = Exo_2({
    variable: "--font-exo",
    subsets: ["latin"],
});
const orbitron = Orbitron({
    variable: "--font-orbitron",
    subsets: ["latin"],
});
export const metadata = {
    title: "GPU Pulse Technologies",
    description: "High-performance graphics cards, AI computing, and gaming hardware.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${exo.variable} ${orbitron.variable} ${bem("app-layout__c2")}`}>
        <Navbar />
        <div className={bem("app-layout__c1")}>{children}</div>
        <Footer />
      </body>
    </html>);
}
