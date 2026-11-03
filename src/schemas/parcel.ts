import { z } from "zod";

export const parcelStatusSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("preparing")
  }),
  z.object({
    kind: z.literal("shipped"),
    carrier: z.string().min(1),
    since: z.iso.date()
  }),
  z.object({
    kind: z.literal("delivered"),
    at: z.iso.date(),
    signedBy: z.string().min(1)
  }),
  z.object({
    kind: z.literal("lost"),
    reportedAt: z.iso.date()
  })
]);

export const parcelSchema = z.object({
  id: z.string().min(1),
  recipient: z.string().min(1),
  weightKg: z.number().positive(),
  status: parcelStatusSchema
});

export const newParcelSchema = parcelSchema.pick({
  recipient: true,
  weightKg: true
});

export const parcelPatchSchema = newParcelSchema.partial();

export const shipParcelSchema = z.object({
  carrier: z.string().min(1),
  date: z.iso.date()
});
