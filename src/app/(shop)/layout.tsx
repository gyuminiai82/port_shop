import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RecentlyViewedSidebar from "@/components/RecentlyViewedSidebar";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <RecentlyViewedSidebar />
      <Footer />
    </>
  );
}
