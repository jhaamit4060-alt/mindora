-- MongoDB indexes setup script
-- Run this using MongoDB Compass or mongo shell

-- Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": -1 });

-- Mood entries indexes
db.mood_entries.createIndex({ "userId": 1, "date": -1 });
db.mood_entries.createIndex({ "createdAt": -1 });

-- Journal entries indexes
db.journal_entries.createIndex({ "userId": 1, "date": -1 });
db.journal_entries.createIndex({ "createdAt": -1 });

-- Exercise sessions indexes
db.exercise_sessions.createIndex({ "userId": 1, "completedAt": -1 });
db.exercise_sessions.createIndex({ "exerciseId": 1 });
