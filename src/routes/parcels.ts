import { Router, type Response } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../db/mongo.ts";
import { ship } from "../parcel.ts";
import { newParcelSchema, parcelPatchSchema, shipParcelSchema } from "../schemas/parcel.ts";
import {
  createParcel,
  getParcel,
  listParcels,
  updateParcel
} from "../services/parcels.ts";

const router = Router();

function badRequest(res: Response, error: z.ZodError) {
  res.status(400).json({
    error: "Invalid request body",
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  });
}

router.get("/", async (_req, res) => {
  res.json(await listParcels());
});

router.get("/:id", async (req, res) => {
  const parcel = await getParcel(req.params.id);
  if (!parcel) {
    res.status(404).json({ error: "Parcel not found" });
    return;
  }

  res.json(parcel);
});

router.post("/", async (req, res) => {
  const result = newParcelSchema.safeParse(req.body);
  if (!result.success) {
    badRequest(res, result.error);
    return;
  }

  const parcel = await createParcel(result.data);
  res.status(201).json(parcel);
});

router.patch("/:id", async (req, res) => {
  const result = parcelPatchSchema.safeParse(req.body);
  if (!result.success) {
    badRequest(res, result.error);
    return;
  }

  const parcel = await updateParcel(req.params.id, result.data);
  if (!parcel) {
    res.status(404).json({ error: "Parcel not found" });
    return;
  }

  res.json(parcel);
});

router.post("/:id/ship", async (req, res) => {
  const result = shipParcelSchema.safeParse(req.body);
  if (!result.success) {
    badRequest(res, result.error);
    return;
  }

  const parcel = await getParcel(req.params.id);
  if (!parcel) {
    res.status(404).json({ error: "Parcel not found" });
    return;
  }

  const shipped = ship(parcel, result.data.carrier, result.data.date);
  if (!shipped.ok) {
    res.status(409).json({ error: "Parcel already shipped" });
    return;
  }

  await getDb()
    .collection("parcels")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: shipped.value.status } }
    );

  res.json(await getParcel(req.params.id));
});

export default router;