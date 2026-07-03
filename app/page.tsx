"use client";

import { useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import Workspace from "@/components/Workspace";
import { useStore, loadCatalog } from "@/lib/store";

export default function Page() {
  const view = useStore((s) => s.view);

  useEffect(() => {
    void loadCatalog();
  }, []);

  return <div id="root-shell">{view === "dashboard" ? <Dashboard /> : <Workspace />}</div>;
}
