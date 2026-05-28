"use client";

import { useState, useTransition } from "react";
import { postProjectComment } from "../../actions";

export default function ProjectComment({
  inquiryId,
  dark = false,
}: {
  inquiryId: string;
  dark?: boolean;
}) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [didPost, setDidPost] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await postProjectComment({
        inquiryId,
        commenterName: name,
        body,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDidPost(true);
      setBody("");
    });
  };

  const inputClass = dark
    ? "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none ring-zinc-600 transition focus:ring-2"
    : "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-2";

  return (
    <div>
      <p className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
        Feedback + revision requests
      </p>
      <p className={`mt-1 text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
        Reference timestamps if helpful (e.g. 0:32).
      </p>
      {didPost ? (
        <p className="mt-3 rounded-md border border-emerald-700/50 bg-emerald-900/30 px-3 py-2 text-sm text-emerald-300">
          Got it — Kenny will see this. Drop another note any time.
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="What would you like changed, or just say thanks."
          className={inputClass}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isPending || !name.trim() || !body.trim()}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send feedback"}
        </button>
      </form>
    </div>
  );
}
