/**
 * MongoDB Migration: Setup Consents Collection
 * Creates indexes for efficient querying of user consents and exercise sessions
 */

const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient

async function setupConsentsCollection() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✓ Connected to MongoDB")

    const db = client.db()

    // Create consents collection with indexes
    console.log("\n📋 Setting up consents collection...")
    try {
      await db.createCollection("consents")
      console.log("✓ Created consents collection")
    } catch (error) {
      if (error.codeName === "NamespaceExists") {
        console.log("✓ Consents collection already exists")
      } else {
        throw error
      }
    }

    // Create indexes on consents collection
    const consentsIndexes = [
      { key: { userId: 1 }, name: "userId_index" },
      { key: { type: 1 }, name: "type_index" },
      { key: { timestamp: -1 }, name: "timestamp_desc_index" },
      { key: { userId: 1, type: 1, timestamp: -1 }, name: "userId_type_timestamp_index" },
    ]

    for (const indexSpec of consentsIndexes) {
      try {
        await db.collection("consents").createIndex(indexSpec.key, { name: indexSpec.name })
        console.log(`✓ Created index: ${indexSpec.name}`)
      } catch (error) {
        if (error.codeName === "IndexOptionsConflict") {
          console.log(`✓ Index already exists: ${indexSpec.name}`)
        } else {
          throw error
        }
      }
    }

    // Create exercise_sessions collection
    console.log("\n⏱️  Setting up exercise_sessions collection...")
    try {
      await db.createCollection("exercise_sessions")
      console.log("✓ Created exercise_sessions collection")
    } catch (error) {
      if (error.codeName === "NamespaceExists") {
        console.log("✓ Exercise sessions collection already exists")
      } else {
        throw error
      }
    }

    // Create indexes on exercise_sessions collection
    const sessionIndexes = [
      { key: { userId: 1 }, name: "userId_index" },
      { key: { exerciseId: 1 }, name: "exerciseId_index" },
      { key: { completedAt: -1 }, name: "completedAt_desc_index" },
      { key: { userId: 1, completedAt: -1 }, name: "userId_completedAt_index" },
    ]

    for (const indexSpec of sessionIndexes) {
      try {
        await db.collection("exercise_sessions").createIndex(indexSpec.key, { name: indexSpec.name })
        console.log(`✓ Created index: ${indexSpec.name}`)
      } catch (error) {
        if (error.codeName === "IndexOptionsConflict") {
          console.log(`✓ Index already exists: ${indexSpec.name}`)
        } else {
          throw error
        }
      }
    }

    // Update users collection schema
    console.log("\n👥 Updating users collection schema...")
    
    // Add consents array to existing users if it doesn't exist
    const updateResult = await db.collection("users").updateMany(
      { consents: { $exists: false } },
      {
        $set: {
          consents: [],
          lastConsentDate: null,
        },
      }
    )
    
    if (updateResult.modifiedCount > 0) {
      console.log(`✓ Updated ${updateResult.modifiedCount} users with consents array`)
    } else {
      console.log("✓ All users already have consents field")
    }

    console.log("\n✅ Database setup completed successfully!\n")
    console.log("Created/Updated:")
    console.log("  - consents collection (with indexes)")
    console.log("  - exercise_sessions collection (with indexes)")
    console.log("  - users collection (consents field)")

  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("\n✓ Database connection closed")
  }
}

// Run the setup
setupConsentsCollection()
