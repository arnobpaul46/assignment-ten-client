import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {}; // এটি খালি রাখুন আপাতত

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

const clientConnected = await clientPromise;
export const db = clientConnected.db(); // এটি অটোমেটিক ইউআরএল থেকে ডাটাবেস নাম নিয়ে নিবে