"use client";

import { useState, useTransition } from "react";
import { submitProjectMessage } from "./actions";

type Message = {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
};

export default function ProjectMessages({
  inquiryId,
  messages: initialMessages,
  dark = false,
}: {
  inquiryId: string;
  messages: Message[];
  dark?: boolean;
}) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await submitProjectMessage({ inquiryId, senderName: name, message: text });
        setText("");
        setSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  const inputClass = dark
    ? "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
    : "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300";

  return (
    <section className="mt-12">
      <p className={`mb-4 text-xs font-medium uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
        Messages
      </p>

      {initialMessages.length > 0 && (
        <ol className="mb-6 space-y-4">
          {initialMessages.map((msg) => (
            <li
              key={msg.id}
              className={`rounded-xl border p-4 ${dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white shadow-sm"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {msg.sender_name}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(msg.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-zinc-700"}`}>{msg.message}</p>
            </li>
          ))}
        </ol>
      )}

      {sent ? (
        <p className={`rounded-xl border p-4 text-sm ${dark ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          Message sent. Kenny will be in touch.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`rounded-xl border p-4 ${dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white shadow-sm"}`}
        >
          <p className={`mb-3 text-sm ${dark ? "text-zinc-400" : "text-zinc-700"}`}>
            Have a question? Send Kenny a note.
          </p>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
            <textarea
              placeholder="Your message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={3}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={isPending}
              className={`inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium transition disabled:opacity-50 ${
                dark
                  ? "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              }`}
            >
              {isPending ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
