"use client";

import { useState } from "react";
import Link from "next/link";

type Inquiry = {
  id: string;
  client_name: string;
  project_type: string;
  event_date: string;
  status: string;
};

// Color per project type — dot on calendar + badge in list
const typeColor = (type: string): string => {
  const t = (type ?? "").toLowerCase();
  if (t.includes("wedding")) return "bg-emerald-500";
  if (t.includes("engagement")) return "bg-blue-500";
  if (t.includes("birthday")) return "bg-rose-500";
  if (t.includes("prom")) return "bg-purple-500";
  if (t.includes("brand")) return "bg-amber-500";
  if (t.includes("music")) return "bg-indigo-500";
  return "bg-zinc-400";
};

const typeLabel = (type: string): string => {
  const t = (type ?? "").toLowerCase();
  if (t.includes("wedding")) return "Wedding";
  if (t.includes("engagement")) return "Engagement";
  if (t.includes("birthday")) return "Birthday";
  if (t.includes("prom")) return "Prom";
  if (t.includes("brand")) return "Brand";
  if (t.includes("music")) return "Music video";
  return type ?? "Event";
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarView({ inquiries }: { inquiries: Inquiry[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map of date string -> inquiries
  const byDate = new Map<string, Inquiry[]>();
  for (const inq of inquiries) {
    const key = inq.event_date.slice(0, 10); // YYYY-MM-DD
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(inq);
  }

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete final row
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const formatDateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const selectedInquiries = selectedDate ? (byDate.get(selectedDate) ?? []) : [];

  // Upcoming shoots: booked inquiries with future event dates
  const upcoming = inquiries
    .filter((i) => i.event_date >= todayStr)
    .slice(0, 8);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      {/* Calendar */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {/* Month navigation */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h2 className="text-base font-semibold text-zinc-900">
            {MONTHS[month]} {year}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-zinc-100">
          {DAYS.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="border-b border-r border-zinc-100 p-2 last:border-r-0" />;
            }
            const dateKey = formatDateKey(day);
            const isToday = dateKey === todayStr;
            const isSelected = dateKey === selectedDate;
            const dayInquiries = byDate.get(dateKey) ?? [];
            const hasShoot = dayInquiries.length > 0;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={`relative flex min-h-[56px] flex-col items-start border-b border-r border-zinc-100 p-2 text-left transition last:border-r-0 hover:bg-zinc-50 ${
                  isSelected ? "bg-zinc-50 ring-1 ring-inset ring-zinc-300" : ""
                }`}
              >
                <span className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700"
                }`}>
                  {day}
                </span>
                {hasShoot && (
                  <div className="flex flex-wrap gap-0.5">
                    {dayInquiries.slice(0, 3).map((inq) => (
                      <span
                        key={inq.id}
                        className={`h-1.5 w-1.5 rounded-full ${typeColor(inq.project_type)}`}
                      />
                    ))}
                    {dayInquiries.length > 3 && (
                      <span className="text-[9px] text-zinc-400">+{dayInquiries.length - 3}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected date panel */}
        {selectedDate && (
          <div className="border-t border-zinc-200 px-6 py-4">
            <p className="mb-3 text-sm font-medium text-zinc-700">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            {selectedInquiries.length === 0 ? (
              <p className="text-sm text-zinc-400">No shoots on this date.</p>
            ) : (
              <div className="space-y-2">
                {selectedInquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    href={`/?q=${encodeURIComponent(inq.client_name)}`}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm hover:bg-zinc-50"
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${typeColor(inq.project_type)}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 truncate">{inq.client_name}</p>
                      <p className="text-xs text-zinc-500">{typeLabel(inq.project_type)}</p>
                    </div>
                    <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      inq.status === "booked"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {inq.status === "booked" ? "Booked" : "Pending"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upcoming shoots sidebar */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-zinc-900">Upcoming shoots</h3>
          </div>
          {upcoming.length === 0 ? (
            <p className="px-4 py-6 text-sm text-zinc-400">No upcoming shoots.</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {upcoming.map((inq) => {
                const d = new Date(inq.event_date + "T12:00:00");
                const isUpcoming = inq.event_date >= todayStr;
                return (
                  <Link
                    key={inq.id}
                    href={`/?q=${encodeURIComponent(inq.client_name)}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50"
                  >
                    <div className="shrink-0 text-center">
                      <p className="text-xs font-medium uppercase text-zinc-400">
                        {d.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="text-xl font-semibold leading-none text-zinc-900">
                        {d.getDate()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">{inq.client_name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${typeColor(inq.project_type)}`} />
                        <p className="text-xs text-zinc-500">{typeLabel(inq.project_type)}</p>
                      </div>
                    </div>
                    {inq.status === "booked" && (
                      <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Booked
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Key</p>
          <div className="space-y-1.5">
            {[
              ["Wedding", "bg-emerald-500"],
              ["Engagement", "bg-blue-500"],
              ["Birthday", "bg-rose-500"],
              ["Prom", "bg-purple-500"],
              ["Brand", "bg-amber-500"],
              ["Music video", "bg-indigo-500"],
              ["Other", "bg-zinc-400"],
            ].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-xs text-zinc-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
