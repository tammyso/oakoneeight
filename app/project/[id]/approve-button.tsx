"use client";

import { useState, useTransition } from "react";
import { approveDeliverable } from "./actions";

export default function ApproveButton({
  inquiryId,
  clientName,
  approved,
}: {
  inquiryId: string;
  clientName: string;
  approved: boolean;
}) {
  const [done, setDone] = useState(approved);
  const [isPending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Film approved
      </div>
    );
  }

  const handleApprove = () => {
    startTransition(async () => {
      await approveDeliverable({ inquiryId, clientName });
      setDone(true);
    });
  };

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={isPending}
      className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Saving..." : "Approve this film"}
    </button>
  );
}
