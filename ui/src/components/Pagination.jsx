import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

function Pagination() {
  function handlePrev() {}
  function handleNext() {}

  return (
    <>
      <p className="text-xs md:text-sm">
        Showing <strong>1</strong> to <strong>5</strong> of <strong>8</strong>{" "}
        results
      </p>
      <div className="text-sm flex gap-2 items-center">
        <button
          className="hover:bg-pink-500 px-2 py-1 rounded-md font-semibold flex items-center"
          onClick={handlePrev}
        >
          <HiChevronLeft /> <span>Previous</span>
        </button>
        <button
          className="hover:bg-pink-500 px-2 py-1 rounded-md font-semibold flex items-center"
          onClick={handleNext}
        >
          <span>Next</span> <HiChevronRight />
        </button>
      </div>
    </>
  );
}

export default Pagination;
