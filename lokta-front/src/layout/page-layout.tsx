import { Outlet } from "react-router-dom";
import Header from "./header";
import Navbar from "./nav-bar";
import Footer from "./footer";
import { Toaster } from "sonner";

function PageLayout() {
  return (
    <>
      <Header />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Toaster />
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default PageLayout;
