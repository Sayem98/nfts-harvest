import Pagination from "./Pagination";
import Table from "./Table";

const brainyNfts = [
  {
    nftID: 111,
    payority: "High",
    date: "1 Jan 2023",
  },
  {
    nftID: 324,
    payority: "Low",
    date: "2 Jan 2023",
  },
  {
    nftID: 122,
    payority: "High",
    date: "5 Jan 2023",
  },
];

const wearyNfts = [
  {
    nftID: 111,
    payority: "High",
    date: "1 Jan 2023",
  },
  {
    nftID: 324,
    payority: "Low",
    date: "2 Jan 2023",
  },
  {
    nftID: 122,
    payority: "High",
    date: "5 Jan 2023",
  },
];

function NFTDashboard({ title, handlePick, luckyNfts = [] }) {
  return (
    <div className="flex flex-col items-center gap-5 bg-[#121e27] w-full rounded-md p-4 md:p-6">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex justify-center relative w-full">
          <strong className="text-lg text-pink-500">{title}</strong>
          <button
            className="bg-pink-500 text-white rounded-md px-4 md:px-6 py-1 block absolute top-0 right-0"
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
          <span>Payority</span>
          <span>date</span>
        </Table.Header>
        <Table.Body>
          {luckyNfts.map((nft, index) => (
            <Table.Row key={index}>
              <span>{index + 1}</span>
              <span>{nft.nftID}</span>
              <span>{nft.payority}</span>
              <span>{nft.date}</span>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Pagination />
        </Table.Footer>
      </Table>
    </div>
  );
}

function AdminDashboard() {
  function handleBrainyPick() {
    console.log("handleBrainyPick");
  }

  function handleWearyPick() {
    console.log("handleWearyPick");
  }

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
