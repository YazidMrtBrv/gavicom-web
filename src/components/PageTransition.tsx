"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // The entry animation lives in CSS (.page-enter) so the page is painted as
  // soon as the HTML arrives instead of waiting for React to hydrate.
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
