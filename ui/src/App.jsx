import { ToastContainer } from "react-toastify";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { polygon, sepolia } from "wagmi/chains";

import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import MobileConnectButton from "./components/MobileConnectButton";
import { UIProvider } from "./contexts/UIContext";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";

const chains = [polygon];
const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: "EbWpcrEoNB5gzeDJi_clFzLbpbgTtuRt", // or infuraId
    walletConnectProjectId: "1134b8f033ffc7945c3513d4fa5f0459",
    chains,

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

function App() {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <UIProvider>
          <div className="w-full h-screen flex flex-col overflow-x-hidden md:overflow-y-scroll px-4 sm:px-24 py-6">
            <Header />
            <main className="flex-1">
              <MobileConnectButton />
              <Dashboard />
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </UIProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
