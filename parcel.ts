
type ParcelStatus =
  | { kind: "preparing" }
  | { kind: "shipped"; carrier: string; since: string }
  | { kind: "delivered"; at: string; signedBy: string }
  | { kind: "lost"; reportedAt: string };

type Parcel = {
  id: string;
  recipient: string;
  weightKg: number;
  status: ParcelStatus;
};

type ResultParcel =
  | { ok: true; value: Parcel }
  | { ok: false; error: string };

function assertNever(value: never): never {
  throw new Error("Etat inconnu : " + JSON.stringify(value));
}

function describe(status: ParcelStatus): string {
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

function ship(
  parcel: Parcel,
  carrier: string,
  date: string
): ResultParcel {
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

// Tests
const parcel: Parcel = {
  id: "p1",
  recipient: "Ada",
  weightKg: 2,
  status: { kind: "preparing" }
};

const shipped = ship(parcel, "Colibri", "2024-03-01");

if (shipped.ok) {
  console.log(describe(shipped.value.status));
} else {
  console.log(shipped.error);
}

// Test : colis deja expedie
if (shipped.ok) {
  console.log(ship(shipped.value, "DHL", "2024-03-02"));
}

// Test : transporteur vide
console.log(ship(parcel, "", "2024-03-01"));

// Verification : colis original non modifie
console.log(parcel.status);
