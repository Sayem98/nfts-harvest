import { ConnectKitButton } from "connectkit";
import Button from "./Button";
import Modal from "./Modal";
import { useUI } from "../contexts/UIContext";

export default function MobileConnectButton() {
  const { modalOpen, setModalOpen, handleRegisterNFT } = useUI();

  return (
    <div className="sm:hidden flex justify-center gap-8 pt-4">
      <Button
        className="h-10 text-sm rounded-lg bg-[#383838] text-white font-semibold"
        onClick={() => setModalOpen(true)}
      >
        Register NFT
      </Button>
      <ConnectKitButton />

      <Modal
        open={modalOpen}
        onClose={setModalOpen}
        onSubmit={handleRegisterNFT}
      />
    </div>
  );
}
