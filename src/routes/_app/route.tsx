import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";

import { Header } from "@/routes/_app/-layouts/header";
import { Sidebar } from "@/routes/_app/-layouts/sidebar";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeView, setActiveView] = useState("Hôm nay");

  return (
    <main className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-muted/30">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </aside>
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <Outlet />
      </section>
    </main>
  );
}
