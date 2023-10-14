import { ConnectKitButton } from "connectkit";
import Button from "./Button";
import Modal from "./Modal";
import { useUI } from "../contexts/UIContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { modalOpen, setModalOpen, handleRegisterNFT } = useUI();

  return (
    <header className="flex items-center justify-evenly sm:justify-between">
      <Link to="/">
        <img
          src="/logo.png"
          alt="NFT Hervesting"
          className="w-20 object-cover"
        />
      </Link>
      <h2 className="text-sm md:text-2xl text-pink-500 uppercase font-bold leading-10 tracking-widest md:ml-44">
        PWS Gamified harvesting
      </h2>
      <div className="hidden sm:flex items-center gap-4">
        <Button onClick={() => setModalOpen(true)}>Register NFT</Button>
        <ConnectKitButton />
      </div>
      <Modal
        open={modalOpen}
        onClose={setModalOpen}
        onSubmit={handleRegisterNFT}
      />
    </header>
  );
}
