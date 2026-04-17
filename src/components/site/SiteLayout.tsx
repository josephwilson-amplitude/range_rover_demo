import { Outlet } from "react-router-dom";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LoginModal from "@/components/site/LoginModal";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginModal />
    </div>
  );
}
