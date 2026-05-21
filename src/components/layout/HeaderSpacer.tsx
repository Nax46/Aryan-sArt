/** Prevents fixed header from overlapping page content */
const HeaderSpacer = () => (
  <div
    className="w-full shrink-0 transition-[height] duration-500 ease-out"
    style={{ height: "var(--site-header-height, 5.5rem)" }}
    aria-hidden
  />
);

export default HeaderSpacer;
