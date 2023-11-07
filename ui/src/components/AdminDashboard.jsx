import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import Table from "./Table";
import { useGetLuckyNfts } from "../hooks/useGetLuckyNfts";
import Spinner from "./Spinner";
import { selectLuckyNfts } from "../services/nftService";
import { PAGE_SIZE } from "../utils/constant";
import { useState } from "react";

function NFTDashboard({
  title,
  handlePick,
  luckyNfts = [],
  paginateKey,
  count,
  page,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col items-center gap-5 bg-[#121e27] w-full rounded-md p-4 md:p-6">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center relative w-full">
          <strong className="text-lg text-pink-500">{title}</strong>
          <div className="md:absolute top-0 right-0 space-x-3 py-2 md:py-0">
            <input
              type="number"
              value={value}
              onChange={onChange}
              className="px-4 py-2 rounded-md text-black focus:outline-none"
              placeholder="Enter reward amount"
            />
            <button
              className="bg-pink-500 text-white rounded-md px-4 md:px-12 py-2 "
              onClick={handlePick}
            >
              Pick
            </button>
          </div>
        </div>
        <p>Lucky &mdash; NFT's</p>
      </div>

      <Table>
        <Table.Header>
          <span>#</span>
          <span>NFT ID</span>
          <span>Rearity</span>
          <span>Reward</span>
          <span>date</span>
        </Table.Header>
        <Table.Body>
          {luckyNfts.map((luckyNft, index) => (
            <Table.Row key={index}>
              <span>{index + 1 + (page - 1) * PAGE_SIZE}</span>
              <span>{luckyNft?.nft?.nftID}</span>
              <span>{luckyNft?.nft?.rarity}</span>
              <span>{luckyNft?.rewardAmount} REVL</span>
              <span>{luckyNft?.createdAt.split("T")[0]}</span>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} paginateKey={paginateKey} />
        </Table.Footer>
      </Table>
    </div>
  );
}

function AdminDashboard() {
  const { address } = useAccount();
  const [searchParams] = useSearchParams();
  const [brainyReward, setBrainyReward] = useState("");
  const [wearyReward, setWearyReward] = useState("");

  const page_brainy = searchParams.get("page_brainy") || 1;
  const page_weary = searchParams.get("page_weary") || 1;
  const limit = PAGE_SIZE;

  const {
    loading: loading1,
    nfts: brainyNfts,
    count: brainyCount,
  } = useGetLuckyNfts(1, address, page_brainy, limit);
  const {
    loading: loading2,
    nfts: wearyNfts,
    count: wearyCount,
  } = useGetLuckyNfts(2, address, page_weary, limit);

  async function handleBrainyPick() {
    if (!brainyReward) return toast.error("Please enter reward amount");

    try {
      await selectLuckyNfts(1, address, brainyReward);
      toast.success("Brainy Budz picked!");
      window.location.reload();
    } catch (err) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data);
    }
  }

  async function handleWearyPick() {
    if (!wearyReward) return toast.error("Please enter reward amount");

    try {
      await selectLuckyNfts(2, address, wearyReward);
      toast.success("Weary Apes picked!");
      window.location.reload();
    } catch (err) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data);
    }
  }

  if (loading1 || loading2) return <Spinner />;

  return (
    <div className="flex flex-col justify-center items-center gap-12 pt-10 w-full">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl">Admin Dashboard</h2>
        <h2 className="text-xl md:text-2xl text-pink-500">
          (Lucky NFT Picker)
        </h2>
      </div>

      <NFTDashboard
        title="Brainy Budz Picker"
        luckyNfts={brainyNfts}
        handlePick={handleBrainyPick}
        count={brainyCount}
        paginateKey="page_brainy"
        page={page_brainy}
        value={brainyReward}
        onChange={(e) => setBrainyReward(e.target.value)}
      />

      <NFTDashboard
        title="Weary Picker"
        luckyNfts={wearyNfts}
        handlePick={handleWearyPick}
        count={wearyCount}
        paginateKey="page_weary"
        page={page_weary}
        value={wearyReward}
        onChange={(e) => setWearyReward(e.target.value)}
      />
    </div>
  );
}

export default AdminDashboard;
