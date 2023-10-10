function Footer() {
  return (
    <footer className="w-full pt-12 md:pt-20">
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-0 md:justify-between text-xs md:text-base px-20 py-5">
        <div />
        <p>
          @ {new Date().getFullYear()}
          <strong className="text-pink-500 ml-2">Purple Wave Studios</strong>
        </p>
        <div className="flex gap-2 font-bold">
          {/* <p>Developed By</p>
          <strong className="text-pink-500">
            <a
              href="https://fiverr.com/users/sayem_abedin"
              target="_blank"
              rel="noreferrer"
            >
              HSA Tech Lab.
            </a>
          </strong> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
