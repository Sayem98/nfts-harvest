import { useState, useEffect } from "react";

export function useNftAvatar({ nftAddress, nftID, type }) {
  const [avatar, setAvatar] = useState(type == 1 ? "brainy.jpg" : "weary.jpg");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "dd6e3c26c1a24f09a9a174c1937a9326",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api_url = `https://api.opensea.io/v2/chain/matic/contract/${nftAddress}/nfts/${nftID}`;
        const response = await fetch(api_url, options);
        const data = await response.json();

        setAvatar(data.nft.image_url);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [nftAddress, nftID]);

  return { avatar };
}
