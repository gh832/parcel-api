import { createApp } from "./app.ts";
import { config } from "./config.ts";
import { connectToMongo } from "./db/mongo.ts";

const app = createApp();

const port = config.PORT;
const mongoUrl = config.MONGO_URL;

await connectToMongo(mongoUrl, "parcels");
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
