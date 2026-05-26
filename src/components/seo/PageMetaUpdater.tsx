"use client";

import { useEffect } from "react";

export default function PageMetaUpdater({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | GAVICOM SAS`;
  }, [title]);
  return null;
}
