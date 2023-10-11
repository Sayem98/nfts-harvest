import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Homepage from "./pages/Homepage";
import Admin from "./pages/Admin";

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
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Homepage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </UIProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
