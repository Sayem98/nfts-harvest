import { useState } from "react";
import Pagination from "./Pagination";
import Table from "./Table";
import { useGetLuckyNfts } from "../hooks/useGetLuckyNfts";
import Spinner from "./Spinner";
import { selectLuckyNfts } from "../services/nftService";
import { toast } from "react-toastify";

function NFTDashboard({ title, handlePick, luckyNfts = [] }) {
  return (
    <div className="flex flex-col items-center gap-5 bg-[#121e27] w-full rounded-md p-4 md:p-6">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex justify-center relative w-full">
          <strong className="text-lg text-pink-500">{title}</strong>
          <button
            className="bg-pink-500 text-white rounded-md px-4 md:px-12 py-2 block absolute top-0 right-0"
            onClick={handlePick}
          >
            Pick
          </button>
        </div>
        <p>Lucky &mdash; NFT's</p>
      </div>

      <Table>
        <Table.Header>
          <span>#</span>
          <span>NFT ID</span>
          <span>Rearity</span>
          <span>date</span>
        </Table.Header>
        <Table.Body>
          {luckyNfts.map((luckyNft, index) => (
            <Table.Row key={index}>
              <span>{index + 1}</span>
              <span>{luckyNft.nft.nftID}</span>
              <span>{(Math.random() * 100).toFixed(2)}</span>
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                  .format(new Date(luckyNft.nft.createdAt))
                  .toString()}
              </span>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Pagination count={luckyNfts.length} />
        </Table.Footer>
      </Table>
    </div>
  );
}

function AdminDashboard() {
  const { loading: loading1, nfts: brainyNfts } = useGetLuckyNfts(1);
  const { loading: loading2, nfts: wearyNfts } = useGetLuckyNfts(2);

  async function handleBrainyPick() {
    try {
      await selectLuckyNfts(1);
      toast.success("Brainy Budz picked!");
      window.location.reload();
    } catch (err) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data);
    }
  }

  async function handleWearyPick() {
    try {
      await selectLuckyNfts(2);
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
      />

      <NFTDashboard
        title="Weary Picker"
        luckyNfts={wearyNfts}
        handlePick={handleWearyPick}
      />
    </div>
  );
}

export default AdminDashboard;
