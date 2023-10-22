import { ConnectKitButton } from "connectkit";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Modal from "./Modal";
import { useUI } from "../contexts/UIContext";
import { useCurrentuser } from "../hooks/useCurrentUser";

export default function MobileConnectButton() {
  const { modalOpen, setModalOpen, handleRegisterNFT } = useUI();
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useCurrentuser();

  return (
    <div className="sm:hidden flex justify-center gap-2 pt-4 text-xs">
      <Button
        className="h-10 rounded-lg bg-[#383838] text-white text-xs font-semibold"
        onClick={() => setModalOpen(true)}
      >
        Register NFT
      </Button>
      <ConnectKitButton />
      {!isLoading && isAdmin && (
        <Button
          className="h-10 text-xs rounded-lg font-semibold"
          onClick={() => navigate("/admin")}
        >
          Admin
        </Button>
      )}

      <Modal
        open={modalOpen}
        onClose={setModalOpen}
        onSubmit={handleRegisterNFT}
      />
    </div>
  );
}
