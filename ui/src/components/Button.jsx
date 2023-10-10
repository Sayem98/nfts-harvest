import PropTypes from "prop-types";
import { cn } from "../utils";

export default function Button({ children, onClick, className, ...rest }) {
  return (
    <button
      className={cn(
        "bg-white hover:bg-pink-600 text-black hover:text-white text-sm px-3 sm:px-4 py-2 sm:py-2 shadow-md rounded-sm transition",
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.element,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
