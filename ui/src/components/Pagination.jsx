import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constant";

function Pagination({ count, paginateKey }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = !searchParams.get(paginateKey)
    ? 1
    : Number(searchParams.get(paginateKey));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function handlePrev() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set(paginateKey, prev);
    setSearchParams(searchParams);
  }

  function handleNext() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set(paginateKey, next);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <>
      <p className="text-xs md:text-sm">
        Showing<span className="mx-1">{(currentPage - 1) * PAGE_SIZE + 1}</span>
        to
        <span className="mx-1">
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>
        of<span className="mx-1">{count}</span>
        results
      </p>
      <div className="text-sm flex gap-2 items-center">
        <button
          className="hover:bg-pink-500 px-2 py-1 rounded-md font-semibold flex items-center"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <HiChevronLeft /> <span>Previous</span>
        </button>
        <button
          className="hover:bg-pink-500 px-2 py-1 rounded-md font-semibold flex items-center"
          onClick={handleNext}
          disabled={currentPage === pageCount}
        >
          <span>Next</span> <HiChevronRight />
        </button>
      </div>
    </>
  );
}

export default Pagination;
