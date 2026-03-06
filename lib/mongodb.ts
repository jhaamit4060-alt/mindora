import { MongoClient, type Db } from "mongodb"

let uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables. Please add it to .env.local")
}

// Remove the key name if it's included in the value (e.g., "MONGODB_URI=mongodb+srv://...")
if (uri.startsWith("MONGODB_URI=")) {
  uri = uri.replace("MONGODB_URI=", "")
}

// Trim whitespace
uri = uri.trim()

const options = {
  maxPoolSize: 10,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("mindora")
}

export default clientPromise
