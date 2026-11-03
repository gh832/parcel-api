import { z } from "zod";
import {
  newParcelSchema,
  parcelPatchSchema,
  parcelSchema,
  parcelStatusSchema
} from "./schemas/parcel.ts";

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export type ParcelStatus = z.output<typeof parcelStatusSchema>;
export type Parcel = z.output<typeof parcelSchema>;
export type NewParcel = z.output<typeof newParcelSchema>;
export type ParcelPatch = z.output<typeof parcelPatchSchema>;

function assertNever(value: never): never {
  throw new Error("Etat inconnu : " + JSON.stringify(value));
}

export function describe(status: ParcelStatus): string {
  switch (status.kind) {
    case "preparing":
      return "Le colis est en preparation";

    case "shipped":
      return `Expedie par ${status.carrier} depuis le ${status.since}`;

    case "delivered":
      return `Livre le ${status.at}, signe par ${status.signedBy}`;

    case "lost":
      return `Colis perdu, signale le ${status.reportedAt}`;

    default:
      return assertNever(status);
  }
}

export function ship(
  parcel: Parcel,
  carrier: string,
  date: string
): Result<Parcel> {
  if (parcel.status.kind !== "preparing") {
    return {
      ok: false,
      error: "Le colis n'est pas en preparation"
    };
  }

  if (carrier.trim() === "") {
    return {
      ok: false,
      error: "Le transporteur est obligatoire"
    };
  }

  const updatedParcel: Parcel = {
    ...parcel,
    status: {
      kind: "shipped",
      carrier: carrier,
      since: date
    }
  };

  return {
    ok: true,
    value: updatedParcel
  };
}