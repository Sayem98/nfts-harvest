import axios from "axios";

// const BASE_API = "https://nft-hervest-4e3c1ea606d9.herokuapp.com/api";
const BASE_API = import.meta.env.VITE_BASE_API_URL;
export async function createNFT(nftID, nftAddress, address) {
  const { data } = await axios.post(`${BASE_API}/nfts`, {
    nftID,
    nftAddress,
    address,
  });
  return data;
}

export async function getNFTs(
  address,
  nftType = 1,
  page = 1,
  limit = 8,
  search
) {
  const { data } = await axios.get(
    `${BASE_API}/nfts-by-type/${address}?nftType=${nftType}&page=${page}&limit=${limit}&search=${search}`
  );
  return data;
}

export async function claimReward(nftID, nftAddress, address) {
  const { data } = await axios.post(`${BASE_API}/claim-reward/${address}`, {
    nftID,
    nftAddress,
    address,
  });

  return data;
}

export async function claimRewardAll(address, nftType) {
  const { data } = await axios.post(
    `${BASE_API}/claim-all/${address}?nftType=${nftType}`
  );

  return data;
}

export async function finalClaim(address) {
  const { data } = await axios.post(`${BASE_API}/final-claim/${address}`);
  return data;
}

export async function getAllLuckyNfts(nftType, address, page, limit) {
  const { data } = await axios.get(
    `${BASE_API}/lucky-nft/${nftType}/${address}?page=${page}&limit=${limit}`
  );
  return data;
}

export async function selectLuckyNfts(nftType, address) {
  const { data } = await axios.post(
    `${BASE_API}/lucky-nft/${nftType}/${address}`
  );
  return data;
}

export async function getLuckyWinner() {
  const { data } = await axios.get(`${BASE_API}/lucky-winner`);
  return data;
}
