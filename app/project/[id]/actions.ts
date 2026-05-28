"use server";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { FROM_ADDRESS } from "@/lib/email";

export async function submitProjectMessage(args: {
  inquiryId: string;
  senderName: string;
  message: string;
}) {
  if (!args.senderName.trim() || !args.message.trim()) {
    throw new Error("Name and message are required.");
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("project_messages").insert({
    inquiry_id: args.inquiryId,
    sender_name: args.senderName.trim(),
    message: args.message.trim(),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/project/${args.inquiryId}`);
}

// Client clicks "Approve this film" — records the timestamp and notifies Kenny.
export async function approveDeliverable(args: {
  inquiryId: string;
  clientName: string;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("inquiries")
    .update({ client_approved_at: new Date().toISOString() })
    .eq("id", args.inquiryId);

  if (error) throw new Error(error.message);

  // Notify Kenny by email.
  if (process.env.RESEND_API_KEY && process.env.OWNER_NOTIFICATION_EMAIL) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oakoneeight.vercel.app";
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: process.env.OWNER_NOTIFICATION_EMAIL,
      subject: `${args.clientName} approved their film`,
      text: [
        `${args.clientName} just approved their final video.`,
        "",
        `View their project room: ${siteUrl}/project/${args.inquiryId}`,
      ].join("\n"),
    }).catch((err: unknown) => console.error("Approval notification failed:", err));
  }

  revalidatePath(`/project/${args.inquiryId}`);
}
