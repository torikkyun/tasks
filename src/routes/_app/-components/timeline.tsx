import { Clock3, MoveRight } from "lucide-react";

const timelineHours = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const timelineStartHour = 6;
const currentHour = 8;
const currentMinute = 0;

export function Timeline() {
  const currentTimePosition =
    ((currentHour - timelineStartHour) * 64 + currentMinute) / 1;

  return (
    <section className="px-8 py-10">
      {/* Header */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Clock3 className="size-3.75 text-mute" strokeWidth={1.8} />

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
              Schedule
            </span>
          </div>

          <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-ink">
            Timeline
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-mute">
          <span>06:00</span>
          <MoveRight className="size-3" />
          <span>22:00</span>

          <span className="mx-1 h-3 w-px bg-hairline" />

          <span>Time-block your tasks</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="ml-16 border-l border-hairline">
          {timelineHours.map((hour) => (
            <TimelineHour key={hour} hour={hour} />
          ))}

          {/* Current time */}
          <div
            className="pointer-events-none absolute left-0 right-0 z-10"
            style={{
              top: `${currentTimePosition}px`,
            }}
          >
            <div className="relative border-t border-accent-red">
              <span className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-accent-red ring-4 ring-white" />

              <span className="absolute left-3 -top-5 rounded-md bg-accent-red px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white">
                NOW
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineHour({ hour }: { hour: string }) {
  return (
    <div className="group relative flex h-16 border-b border-hairline">
      {/* Time */}
      <span className="absolute -left-16 top-1.75 w-12 text-right font-mono text-[10px] tracking-tight text-mute">
        {hour}
      </span>

      {/* Hour marker */}
      <span className="absolute -left-px -top-px size-1.5 -translate-x-1/2 rounded-full bg-hairline transition-colors group-hover:bg-ink" />

      {/* Content area */}
      <div className="flex-1 px-5 py-2 transition-colors group-hover:bg-[#fafafa]" />
    </div>
  );
}
