import { createPortal } from "react-dom";
import { ImSpinner3 } from "react-icons/im";

function Spinner() {
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-gray-200/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="flex items-center gap-4">
        <ImSpinner3 className="animate-spin text-4xl text-white" />
        <span className="text-2xl text-white">Loading...</span>
      </div>
    </div>,
    document.getElementById("spinner-root")
  );
}

export default Spinner;
