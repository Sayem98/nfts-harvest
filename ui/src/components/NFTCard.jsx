import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { useUI } from "../contexts/UIContext";

export default function NFTCard({ item, type }) {
  // console.log(item);
  const { level, nftID, nftAddress, lastClaimed, rewardType, claimedDays } =
    item;
  const { handleClaim } = useUI();
  const [timeRemaining, setTimeRemaining] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [alreadyClaimed, setAlreadyClaimed] = useState(true);

  // console.log(lastClaimed);

  useEffect(() => {
    if (!lastClaimed) {
      setAlreadyClaimed(false);
    } else {
      const claimDay = new Date(lastClaimed).getUTCDate();
      const claimMonth = new Date(lastClaimed).getUTCMonth() + 1;
      const claimYear = new Date(lastClaimed).getUTCFullYear();

      const todayDay = new Date().getUTCDate();
      const todayMonth = new Date().getUTCMonth() + 1;
      const todayYear = new Date().getUTCFullYear();

      if (
        todayYear > claimYear ||
        todayMonth > claimMonth ||
        todayDay > claimDay
      ) {
        setAlreadyClaimed(false);
      }
    }
  }, [lastClaimed]);

  useEffect(() => {
    // count down every second from todays 12:00 AM to now
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      const second = new Date().getSeconds();
      const miliseconds = new Date().getMilliseconds();

      const totalSeconds = hour * 60 * 60 + minute * 60 + second;
      const totalMiliseconds = totalSeconds * 1000 + miliseconds;

      const remainingTime = 86400000 - totalMiliseconds;
      const remainingHour = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinute = Math.floor(
        (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
      );
      const remainingSecond = Math.floor(
        ((remainingTime % (60 * 60 * 1000)) % (60 * 1000)) / 1000
      );

      setTimeRemaining({
        hour: remainingHour,
        minute: remainingMinute,
        second: remainingSecond,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // fetch image from imgUrl
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "dd6e3c26c1a24f09a9a174c1937a9326",
    },
  };
  console.log(imgUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const api_url = `https://api.opensea.io/v2/chain/matic/contract/${nftAddress}/nfts/${nftID}`;
        const response = await fetch(api_url, options);
        const data = await response.json();
        console.log(data);
        console.log(data.nft.image_url);
        setImgUrl(data.nft.image_url);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [nftAddress, nftID]);

  return (
    <div className="bg-[#121e27] rounded-md overflow-hidden border border-gray-600 hover:border-pink-600 hover:scale-105 transition delay-100">
      <img
        src={imgUrl ? imgUrl : type == 1 ? "brainy.jpg" : "weary.jpg"}
        // src="https://ipfs.io/ipfs/QmajSgqqWnPwhNDWLvoTcH9kbZAvUzx18rvqYpizLroioQ/2758.png"
        alt=""
        className="object-cover w-full"
      />
      <div className="flex flex-col p-4 items-center gap-1">
        <h2 className="text-2xl italic text-center text-pink-600">
          NFT ID: {nftID}
        </h2>
        <h2 className="text-2xl italic text-center">Level #{level}</h2>
        <h2 className="text-2xl italic text-center">
          Streak #{claimedDays} days
        </h2>
        <p className="text-gray-400">
          Harvest amount:
          <strong className="text-pink-600 font-bold ml-2">
            {rewardType}/day
          </strong>
        </p>
        <Button
          className="w-full mt-3 uppercase"
          onClick={() => {
            handleClaim(nftID, nftAddress), setAlreadyClaimed(true);
          }}
          disabled={alreadyClaimed}
        >
          {alreadyClaimed ? "Harvested" : "Harvest"}
        </Button>
        <p className="text-xs md:text-sm text-gray-400 mt-2">
          Remaining time {timeRemaining.hour}h: {timeRemaining.minute}m:
          {timeRemaining.second} sec
        </p>
      </div>
    </div>
  );
}

NFTCard.propTypes = {
  item: PropTypes.object,
};
