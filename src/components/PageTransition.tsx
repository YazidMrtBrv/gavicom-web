"use client";

import { usePathname } from "next/navigation";
import { Fragment, useEffect } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // The key remounts the template on every pathname change so its CSS
  // curtain and .page-enter entry (app/template.tsx) replay each time.
  return <Fragment key={pathname}>{children}</Fragment>;
}
