import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import Button from "./Button";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

export default function Modal({ open, onClose, onSubmit }) {
  const [nftID, setNftId] = useState("");
  const [nftAddress, setNftnftAddress] = useState(
    "0xbecD7689228e25B71bCe3Ce3A40c68f01475954b"
  );
  const { address } = useAccount();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#bb31a4] rounded-sm shadow-lg flex flex-col md:flex-row items-start w-full md:min-w-fit md:w-[30rem] h-full md:h-fit">
        <div className="text-black flex flex-col justify-center">
          <div className="flex justify-between mb-6 px-6 py-4 border-b">
            <h2 className="text-xl uppercase text-white">Register NFT</h2>
            <button
              className="text-lg w-6 h-6 flex justify-center items-center bg-gray-200 p-1 rounded-full"
              onClick={() => onClose(false)}
            >
              <IoMdClose />
            </button>
          </div>
          <form
            className="w-[23rem] sm:w-[30rem]  px-6 space-y-4 flex flex-col pb-8"
            onSubmit={(e) => {
              onSubmit(e, nftID, nftAddress);
            }}
          >
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="nftID">NFT ID</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                id="nftID"
                value={nftID}
                onChange={(e) => setNftId(e.target.value)}
                placeholder="For multiple NFTs, separate IDs with a comma"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="nftAddress">NFT Address</label>

              <select
                id="nftAddress"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={nftAddress}
                onChange={(e) => setNftnftAddress(e.target.value)}
              >
                <option
                  value="0xbecD7689228e25B71bCe3Ce3A40c68f01475954b"
                  className="hover:bg-pink-400"
                >
                  BRAINY BUDZ
                </option>
                <option
                  value="0x68F809ACb313ca01e1dc36FB484EcD95a5f19dc9"
                  className="hover:bg-pink-400"
                >
                  WEARY APES
                </option>
              </select>
            </div>

            {address && (
              <Button className="bg-[#121e27] hover:bg-[#1a2b38] text-white self-center w-full sm:py-3 rounded-md">
                Register NFT
              </Button>
            )}
          </form>
          {!address && (
            <div className="w-full self-stretch px-6">
              <ConnectKitButton.Custom>
                {({ isConnected, show, address }) => {
                  return (
                    <button
                      onClick={show}
                      className="bg-black w-full text-white text-sm rounded-lg py-2"
                    >
                      {isConnected ? address : "Connect Wallet"}
                    </button>
                  );
                }}
              </ConnectKitButton.Custom>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
