import PropTypes from "prop-types";

export default function SectionCard({ children, title }) {
  return (
    <div className="flex flex-col items-center bg-[#121e27] p-6 rounded-md shadow-lg">
      <h4 className="text-2xl font-semibold uppercase text-pink-500">
        {title}
      </h4>
      {children}
    </div>
  );
}

SectionCard.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};
