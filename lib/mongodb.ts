import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set. Please add it to .env.local")
}

if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
  throw new Error(`Invalid MONGODB_URI format. Got: ${uri.substring(0, 50)}... Expected to start with 'mongodb://' or 'mongodb+srv://'`)
}

const options = {}

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
