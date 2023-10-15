import PropTypes from "prop-types";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import Button from "./Button";
import SectionCard from "./SectionCard";
import NFTList from "./NFTList";
import { useUI } from "../contexts/UIContext";
import Modal from "./Modal";
import Spinner from "./Spinner";

function CardItem({ title, value }) {
  return (
    <p className="text-gray-400 text-lg">
      {title}:<strong className="text-pink-600 font-bold ml-2">{value}</strong>
    </p>
  );
}

export default function Dashboard() {
  const {
    isLoading,
    isLoadingNFT,
    isLoadingUser,
    nftsBB,
    nftsWA,
    modalOpen,
    setModalOpen,
    handleRegisterNFT,
    balance,
    handleFinalClaim,
    limit,
    pageBB,
    pageWA,
    setPageBB,
    setPageWA,
    setSearchBB,
    setSearchWA,
    luckyWinner,
  } = useUI();

  const { address } = useAccount();

  const totalPageBB = Math.ceil(nftsBB.total / limit);
  const totalPageWA = Math.ceil(nftsWA.total / limit);

  function handlePrevBB() {
    if (pageBB <= 1) return;

    setPageBB((pageBB) => pageBB - 1);
  }

  function handleNextBB() {
    if (pageBB >= totalPageBB) return;

    setPageBB((pageBB) => pageBB + 1);
  }

  function handlePrevWA() {
    if (pageWA <= 1) return;

    setPageWA((pageWA) => pageWA - 1);
  }

  function handleNextWA() {
    if (pageWA >= totalPageWA) return;

    setPageWA((pageWA) => pageWA + 1);
  }

  function handleSearchBB(value) {
    setSearchBB(value);
  }
  function handleSearchWA(value) {
    setSearchWA(value);
  }

  // eslint-disable-next-line no-unreachable
  return (
    <div className="flex flex-col gap-16 sm:gap-24 mt-10">
      {(isLoading || isLoadingNFT || isLoadingUser) && <Spinner />}
      <SectionCard title="Dashboard">
        <div className="flex gap-5 items-center justify-center md:justify-evenly w-full mt-10">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`uppercase ${
                luckyWinner?.luckyNftBrainy ? "text-green-500" : "text-red-500"
              } text-center`}
            >
              <p className="tracking-widest text-xl">
                {luckyWinner?.luckyNftBrainy ? "Winner" : "No winner"}
              </p>
              <p className="text-pink-500">BRAINY BUDZ</p>
            </div>
            <img
              src={luckyWinner?.luckyNftBrainy?.nft?.imageUrl || "/brainy.jpg"}
              alt=""
              className="w-72 rounded-md object-cover"
            />
            <div className="text-gray-200 text-lg">
              NFT ID:
              <span className="text-pink-600 font-bold ml-2">
                {luckyWinner?.luckyNftBrainy?.nft?.nftID}
              </span>
            </div>
            <div className="text-gray-200 text-lg">
              Win:
              <span className="text-pink-600 font-bold ml-2">100 REVL</span>
            </div>
          </div>
          <div className="hidden py-6 md:flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-16">
              {/* <CardItem title="Total hervest" value={toalHervert} /> */}
              <CardItem title="Brainy Budz" value={nftsBB?.total || 0} />
              <CardItem title="Balance" value={balance + " REVL"} />
              <CardItem title="Weary Apes" value={nftsWA?.total || 0} />
            </div>
            <Button
              className="self-center uppercase mt-5 px-12 sm:px-12 font-bold"
              onClick={handleFinalClaim}
            >
              Claim
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`uppercase ${
                luckyWinner?.luckyNftWeary ? "text-green-500" : "text-red-500"
              } text-center`}
            >
              <p className="tracking-widest text-xl">
                {luckyWinner?.luckyNftWeary ? "Winner" : "No winner"}
              </p>
              <p className="text-pink-500">WEARY APES</p>
            </div>
            <img
              src={luckyWinner?.luckyNftWeary?.nft?.imageUrl || "/weary.jpg"}
              alt=""
              className="w-72 rounded-md object-cover"
            />
            <div className="text-gray-200 text-lg">
              NFT ID:
              <span className="text-pink-600 font-bold ml-2">
                {luckyWinner?.luckyNftWeary?.nft?.nftID}
              </span>
            </div>
            <div className="text-gray-200 text-lg">
              Win:
              <span className="text-pink-600 font-bold ml-2">200 REVL</span>
            </div>
          </div>
        </div>
        <div className="py-6 flex md:hidden flex-col gap-4 mt-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-24">
            {/* <CardItem title="Total hervest" value={toalHervert} /> */}
            <CardItem title="Brainy Budz" value={nftsBB?.total || 0} />
            <CardItem title="Balance" value={balance + " REVL"} />
            <CardItem title="Weary Apes" value={nftsWA?.total || 0} />
          </div>
          <Button
            className="self-center uppercase mt-5 px-12 sm:px-12 font-bold"
            onClick={handleFinalClaim}
          >
            Claim
          </Button>
        </div>
      </SectionCard>

      <NFTList
        title="Brainy Budz"
        nftItems={nftsBB.nfts}
        total={nftsBB.total}
        handlePrev={handlePrevBB}
        handleNext={handleNextBB}
        disabledPrevBtn={pageBB === 1}
        disabledNextBtn={pageBB === totalPageBB}
        handleSearch={handleSearchBB}
        type={1}
      />
      <NFTList
        title="Weary Apes"
        nftItems={nftsWA.nfts}
        total={nftsWA.total}
        handlePrev={handlePrevWA}
        handleNext={handleNextWA}
        disabledPrevBtn={pageWA === 1}
        disabledNextBtn={pageWA === totalPageWA}
        handleSearch={handleSearchWA}
        type={2}
      />

      {/* nfts lenght is 0 then show message */}
      {nftsBB?.nfts?.length === 0 &&
        nftsWA?.nfts?.length === 0 &&
        (!isLoading || !isLoadingNFT || !isLoadingUser) && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl italic text-center">
              You don't have any NFTs
            </h2>
            {address ? (
              <Button
                className="mt-3 uppercase"
                onClick={() => setModalOpen(true)}
              >
                Register NFT
              </Button>
            ) : (
              <ConnectKitButton />
            )}
          </div>
        )}
      <Modal
        open={modalOpen}
        onClose={setModalOpen}
        onSubmit={handleRegisterNFT}
      />
    </div>
  );
}

CardItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
};
