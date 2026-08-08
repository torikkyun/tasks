import {
  CalendarDays,
  Download,
  FileText,
  Folder,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Settings2,
  SunMedium,
  Timer,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

export function Sidebar({
  activeView,
  setActiveView,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
}) {
  return (
    <aside className="flex h-screen w-62 shrink-0 flex-col bg-white">
      {/* Brand */}
      <div className="flex h-18 items-center px-6">
        <button className="group flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-white transition-transform duration-200 group-hover:-rotate-3">
            <LayoutGrid className="size-4" strokeWidth={2.2} />
          </span>

          <span className="text-sm font-semibold tracking-tight text-ink">
            FlowSpace
          </span>
        </button>
      </div>

      <div className="flex-1 px-4">
        {/* Workspace */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mute">
              Workspace
            </span>

            <button className="text-mute transition-colors hover:text-ink">
              <MoreHorizontal className="size-4" />
            </button>
          </div>

          <nav className="space-y-0.5">
            <SidebarItem
              icon={<CalendarDays />}
              label="Hôm nay"
              active={activeView === "Hôm nay"}
              onClick={() => setActiveView("Hôm nay")}
            />

            <SidebarItem
              icon={<Timer />}
              label="Focus Timer"
              active={activeView === "Focus Timer"}
              onClick={() => setActiveView("Focus Timer")}
            />

            <SidebarItem
              icon={<FileText />}
              label="Notes"
              active={activeView === "Notes"}
              onClick={() => setActiveView("Notes")}
            />

            <SidebarItem
              icon={<SunMedium />}
              label="Daily Note"
              active={activeView === "Daily Note"}
              onClick={() => setActiveView("Daily Note")}
            />
          </nav>
        </div>

        {/* Projects */}
        <div>
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mute">
              Projects
            </span>

            <button className="text-mute transition-colors hover:text-ink">
              <Plus className="size-4" strokeWidth={1.8} />
            </button>
          </div>

          <div className="space-y-0.5">
            <ProjectItem color="text-accent-blue-info" label="FlowSpace App" />

            <ProjectItem color="text-accent-purple" label="Đọc sách 2026" />

            <ProjectItem color="text-accent-green" label="Sức khỏe" />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 pb-5">
        <Separator className="mb-3 bg-hairline" />

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-body transition-colors hover:bg-muted hover:text-ink">
          <SunMedium className="size-4" strokeWidth={1.8} />
          <span>Appearance</span>
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-body transition-colors hover:bg-muted hover:text-ink">
          <Download className="size-4" strokeWidth={1.8} />
          <span>Xuất dữ liệu</span>
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-body transition-colors hover:bg-muted hover:text-ink">
          <Settings2 className="size-4" strokeWidth={1.8} />
          <span>Cài đặt</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm",
        "transition-all duration-150",
        active
          ? "bg-muted font-medium text-ink"
          : "text-body-mid hover:bg-muted hover:text-ink",
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 h-4 w-0.5 rounded-full bg-ink" />
      )}

      <span
        className={[
          "flex size-4 items-center justify-center transition-colors",
          active ? "text-ink" : "text-mute group-hover:text-body",
        ].join(" ")}
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

function ProjectItem({ color, label }: { color: string; label: string }) {
  return (
    <button className="group flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-body-mid transition-colors hover:bg-muted hover:text-ink">
      <Folder
        className={[
          "size-4 shrink-0",
          color,
          "transition-transform duration-150",
        ].join(" ")}
      />

      <span className="truncate">{label}</span>
    </button>
  );
}
