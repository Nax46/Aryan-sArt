import { useEffect, useRef } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";

/** Fixed announcement + navbar — sets --site-header-height for page offset */
const FixedSiteHeader = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--site-header-height", `${h}px`);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[9999] w-full max-w-[100vw]"
      id="site-header"
    >
      <AnnouncementBar />
      <Navbar />
    </div>
  );
};

export default FixedSiteHeader;
