import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.ts";
import type { NewParcel, Parcel, ParcelPatch } from "../parcel.ts";

type ParcelDocument = Omit<Parcel, "id"> & { _id: ObjectId };

function toParcel(document: ParcelDocument): Parcel {
  const { _id, ...parcel } = document;
  return { ...parcel, id: _id.toHexString() };
}

export async function listParcels(): Promise<Parcel[]> {
  const documents = await getDb()
    .collection<ParcelDocument>("parcels")
    .find()
    .toArray();
  return documents.map(toParcel);
}

export async function getParcel(id: string): Promise<Parcel | undefined> {
  if (!ObjectId.isValid(id)) {
    return undefined;
  }

  const document = await getDb()
    .collection<ParcelDocument>("parcels")
    .findOne({ _id: new ObjectId(id) });
  return document ? toParcel(document) : undefined;
}

export async function createParcel(input: NewParcel): Promise<Parcel> {
  const collection = getDb().collection<ParcelDocument>("parcels");
  const document: Omit<Parcel, "id"> = {
    ...input,
    status: { kind: "preparing" }
  };

  const result = await collection.insertOne(document as ParcelDocument);
  return toParcel({ ...document, _id: result.insertedId } as ParcelDocument);
}

export async function updateParcel(
  id: string,
  patch: ParcelPatch
): Promise<Parcel | undefined> {
  if (!ObjectId.isValid(id)) {
    return undefined;
  }

  const document = await getDb()
    .collection<ParcelDocument>("parcels")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: patch },
      { returnDocument: "after" }
    );
  return document ? toParcel(document) : undefined;
}