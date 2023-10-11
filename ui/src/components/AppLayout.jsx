import MobileConnectButton from "./MobileConnectButton";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="w-full h-screen flex flex-col overflow-x-hidden md:overflow-y-scroll px-4 sm:px-24 py-6">
      <Header />
      <main className="flex-1">
        <MobileConnectButton />
        {<Outlet />}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
