import PropTypes from "prop-types";
import {
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
  HiChevronDown,
} from "react-icons/hi2";
import NFTCard from "./NFTCard";
import Button from "./Button";
import { useUI } from "../contexts/UIContext";
import { useState } from "react";

export default function NFTList({
  total,
  title,
  nftItems,
  handlePrev,
  handleNext,
  disabledPrevBtn,
  disabledNextBtn,
  handleSearch,
  type,
}) {
  const [show, setShow] = useState(true);
  const [search, setSearch] = useState("");
  const { handleClaimAll } = useUI();

  function handleAllClaim() {
    handleClaimAll(type);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-0 justify-between">
        <div className="flex gap-4 items-center">
          <h4 className="text-2xl uppercase text-gray-200">{title}</h4>
          {show ? (
            <HiChevronUp
              className="text-3xl text-gray-100 font-extrabold cursor-pointer"
              onClick={() => setShow((show) => !show)}
            />
          ) : (
            <HiChevronDown
              className="text-3xl text-gray-100 font-extrabold cursor-pointer"
              onClick={() => setShow((show) => !show)}
            />
          )}
        </div>
        {show && total !== 0 && (
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={`Search ${title}...`}
                className="w-[16rem] md:w-[20rem] bg-gray-50 border border-gray-300 text-gray-900 text-base outline-none focus:ring-pink-500 focus:border-pink-500 block p-2"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                className="text-base"
                onClick={() => handleSearch(search)}
              >
                Search
              </Button>
            </div>
            <Button
              className="text-base bg-pink-600 text-white"
              onClick={handleAllClaim}
            >
              Harvest All
            </Button>
          </div>
        )}

        {show && total !== 0 && (
          <div className="self-end flex items-center gap-5 md:gap-8">
            <button
              className="bg-pink-600 transition hover:bg-pink-500 rounded-full p-1 shadow-xl"
              onClick={handlePrev}
              disabled={disabledPrevBtn}
            >
              <HiChevronLeft className="text-3xl text-gray-100 font-extrabold" />
            </button>
            <button
              className="bg-pink-600 transition hover:bg-pink-500 rounded-full p-1 shadow-xl"
              onClick={handleNext}
              disabled={disabledNextBtn}
            >
              <HiChevronRight className="text-3xl text-gray-100 font-extrabold" />
            </button>
          </div>
        )}
      </div>
      {show && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nftItems?.map((item, i) => (
            <NFTCard key={i} item={item} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}

NFTList.propTypes = {
  title: PropTypes.string,
  nftItems: PropTypes.array,
};
