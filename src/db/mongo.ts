import { MongoClient, type Db } from "mongodb";

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToMongo(url: string, dbName: string): Promise<void> {
  const mongoClient = new MongoClient(url);
  await mongoClient.connect();
  client = mongoClient;
  db = mongoClient.db(dbName);
}

export function getDb(): Db {
  if (!db) {
    throw new Error("MongoDB is not connected");
  }

  return db;
}