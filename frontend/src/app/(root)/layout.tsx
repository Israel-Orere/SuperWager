import Aside from "@/components/aside";
import Navbar from "@/components/navbar";
import { AuthModalProvider } from "@/context/AuthModalContext";
import AuthModalWrapper from "@/components/AuthModalWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthModalProvider>
      <main className="relative">
        <Navbar />
        <div className="w-full min-h-screen p-[5%] flex gap-16 max-w-screen-2xl mx-auto">
          <div className="flex-[75%]">{children}</div>
          <Aside />
        </div>
        <AuthModalWrapper />
      </main>
    </AuthModalProvider>
  );
}
