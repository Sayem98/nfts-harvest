import { useState, useEffect } from "react";
import { getAllLuckyNfts } from "../services/nftService";

export function useGetLuckyNfts(nftType, address, page, limit) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  async function getLuckyNfts(nftType) {
    try {
      setLoading(true);
      const data = await getAllLuckyNfts(nftType, address, page, limit);
      setNfts(data?.nfts);
      setCount(data?.count);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLuckyNfts(nftType);
  }, [nftType, address, page]);

  return { loading, nfts, count, error };
}
