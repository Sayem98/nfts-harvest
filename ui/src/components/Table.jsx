function TableHeader({ children }) {
  return (
    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_2fr_1fr] border border-gray-600 w-full px-4 py-2 font-semibold">
      {children}
    </div>
  );
}

function TableBody({ children }) {
  return (
    <div className="space-y-2 py-2 bg-[#1c303f] border-x border-gray-600">
      {children}
    </div>
  );
}

function TableRow({ children }) {
  return (
    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_2fr_1fr] px-4 md:py-2 border-b border-gray-600 first:border-t-0 last:border-b-0">
      {children}
    </div>
  );
}

function TableFooter({ children }) {
  return (
    <div className="flex items-center justify-between border px-3 py-2 border-gray-600">
      {children}
    </div>
  );
}

function Table({ children }) {
  return (
    <div role="table" className="md:w-[50rem]">
      {children}
    </div>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Footer = TableFooter;

export default Table;
