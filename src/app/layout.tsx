import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata = {
  title: {
    default: "Ex-Army - Free website for PG & Hostel owners",
    template: "%s | Ex-Army",
  },
  description:
    "Create your own free website for your PG and hostel. Show your branches, upload photos and videos, and give customers direct directions to each branch with Google Maps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}