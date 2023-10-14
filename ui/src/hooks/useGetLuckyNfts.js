import { useState, useEffect } from "react";
import { getAllLuckyNfts } from "../services/nftService";

export function useGetLuckyNfts(nftType) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getLuckyNfts(nftType) {
    try {
      setLoading(true);
      const data = await getAllLuckyNfts(nftType);
      setNfts(data?.nfts);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLuckyNfts(nftType);
  }, [nftType]);

  return { loading, nfts, error };
}
