
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: 'Fable – Ebook Sharing Platform',
  description: 'Discover, purchase, and publish original ebooks.',
  icons: '/favicon.svg',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#09090b] text-white antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}