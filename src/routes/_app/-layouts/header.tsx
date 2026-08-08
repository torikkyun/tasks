import { Command, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-18 items-center justify-between px-8">
      <div>
        <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-mute">
          Thursday · 08 August
        </p>

        <h1 className="text-[20px] font-semibold tracking-[-0.035em] text-ink">
          Hôm nay
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="group flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] text-body-mid transition-colors hover:bg-muted hover:text-ink">
          <Search className="size-3.75" strokeWidth={1.8} />

          <span>Tìm kiếm</span>

          <kbd className="ml-5 inline-flex h-5 items-center gap-0.5 rounded border border-hairline bg-white px-1.5 font-mono text-[10px] text-mute shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <Command className="size-2.5" />P
          </kbd>
        </button>

        <button className="grid size-9 place-items-center rounded-lg text-body-mid transition-colors hover:bg-muted hover:text-ink">
          <SlidersHorizontal className="size-3.75" strokeWidth={1.8} />
        </button>

        <Button
          size="default"
          className="ml-1 h-9 rounded-[4px] bg-primary px-4 text-[13px] font-medium text-primary-foreground shadow-none transition-all hover:-translate-y-px hover:bg-primary/90 hover:shadow-sm"
        >
          <Plus className="size-4" strokeWidth={2} />
          Task mới
        </Button>
      </div>
    </header>
  );
}
