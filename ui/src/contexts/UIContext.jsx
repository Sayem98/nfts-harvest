import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import {
  claimReward,
  createNFT,
  getNFTs,
  claimRewardAll,
  finalClaim,
} from "../services/nftService";
import { getUserData } from "../services/userService";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/contract";

import Web3 from "web3";
const UIContext = createContext();

/* eslint-disable react/prop-types */
function UIProvider({ children }) {
  const { address } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const [nftsBB, setNFTsBB] = useState([]);
  const [nftsWA, setNFTsWA] = useState([]);
  const [toalHervert, setTotalHervert] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isSuccessNFT, setIsSuccessNFT] = useState(false);
  const [isSuccessClaim, setIsSuccessClaim] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  //   const [error, setError] = useState(null);
  // pagination
  const [pageBB, setPageBB] = useState(1);
  const [pageWA, setPageWA] = useState(1);
  const [limit] = useState(8);
  // search
  const [searchBB, setSearchBB] = useState("");
  const [searchWA, setSearchWA] = useState("");

  useEffect(() => {
    if (!address) return;

    async function fetchNFTs() {
      try {
        setIsLoadingNFT(true);
        const nftsBB = await getNFTs(address, 1, pageBB, limit, searchBB);
        setNFTsBB(nftsBB);

        const nftsWA = await getNFTs(address, 2, pageWA, limit, searchWA);
        setNFTsWA(nftsWA);
      } finally {
        setIsLoadingNFT(false);
      }
    }

    fetchNFTs();
  }, [
    address,
    isSuccessNFT,
    isSuccessClaim,
    pageBB,
    pageWA,
    limit,
    searchBB,
    searchWA,
  ]);

  useEffect(() => {
    async function getAndCreate() {
      try {
        setIsLoadingUser(true);
        const data = await getUserData(address);

        setTotalHervert(data.totalClaimedReward);
        let points = 0;
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const hervest = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          points = await hervest.methods.points(address).call();
          //convest to ether
          points = Web3.utils.fromWei(points, "ether");
        }
        setBalance(Number(data.totalReward) + Number(points));
      } finally {
        setIsLoadingUser(false);
      }
    }

    if (address) getAndCreate();
  }, [address, isSuccessClaim]);

  async function handleRegisterNFT(e, nftID, nftAddress) {
    e.preventDefault();
    setIsSuccessNFT(false);
    setIsLoading(true);
    if (!address) return toast.error("Please connect wallet 22222");

    if (!nftID || !nftAddress || !address) return;

    try {
      const data = await createNFT(nftID, nftAddress, address);
      console.log(data);
      toast.success(`Successfully registered ${data.nRegister} NFTs`);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    } finally {
      setModalOpen(false);
      setIsSuccessNFT(true);
      setIsLoading(false);
    }
  }

  async function handleClaim(nftID, nftAddress) {
    if (!address) return toast.error("Please connect wallet");
    try {
      setIsSuccessClaim(false);
      setIsLoading(true);
      await claimReward(nftID, nftAddress, address);
      toast.success("Harvested successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    } finally {
      setIsSuccessClaim(true);
      setIsLoading(false);
    }
  }

  async function handleClaimAll(nftType) {
    if (!address) return toast.error("Please connect wallet");
    try {
      setIsSuccessClaim(false);
      setIsLoading(true);
      await claimRewardAll(address, nftType);
      toast.success("All harvested successfully");
      // realod page
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    } finally {
      setIsSuccessClaim(true);
      setIsLoading(false);
    }
  }

  async function handleFinalClaim() {
    if (!address) return toast.error("Please connect wallet");
    try {
      setIsSuccessClaim(false);
      setIsLoading(true);

      await finalClaim(address);

      const web3 = new Web3(window.ethereum);
      const hervest = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      await hervest.methods.claim().send({ from: address });
      toast.success("Claimed successfully");
      setIsSuccessClaim(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data);
    } finally {
      setIsSuccessClaim(true);
      setIsLoading(false);
    }
  }

  return (
    <UIContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        handleRegisterNFT,
        nftsBB,
        nftsWA,
        toalHervert,
        balance,
        handleClaim,
        handleClaimAll,
        handleFinalClaim,
        isLoading,
        isLoadingNFT,
        isLoadingUser,
        setPageBB,
        setPageWA,
        pageBB,
        pageWA,
        limit,
        setSearchBB,
        setSearchWA,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
}

export { useUI, UIProvider };
