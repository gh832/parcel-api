import express from "express";
import parcelsRouter from "./routes/parcels.ts";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.get("/", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/parcels", parcelsRouter);

  return app;
}