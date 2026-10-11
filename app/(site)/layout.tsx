import CartDrawer from "@/components/CartDrawer";
import CartProvider from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import WhatsAppFloat from "@/components/WhatsAppFloat";

/**
 * Public storefront chrome — everything under (site) gets the header,
 * cart, footer and store JSON-LD. Admin (/admin) and API routes stay bare.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CartDrawer />
      <JsonLd />
    </CartProvider>
  );
}
