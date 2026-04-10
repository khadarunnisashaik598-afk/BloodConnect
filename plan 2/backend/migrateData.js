require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Try to bypass system DNS using Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import models
const Donor = require("./models/Donor");
const User = require("./models/User");
const BloodRequest = require("./models/BloodRequest");

async function migrate() {
  console.log("🚀 Starting data migration from Local (Compass) to Atlas...");

  // 1. Setup Connections
  const localUri = "mongodb://127.0.0.1:27017/bloodconnect";
  const atlasUri = process.env.MONGODB_URI;

  if (!atlasUri) {
    console.error("❌ Error: MONGODB_URI not found in .env file");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to Local MongoDB...");
    const localConn = await mongoose.createConnection(localUri).asPromise();
    console.log("✅ Connected to Local MongoDB");

    console.log("🔗 Connecting to MongoDB Atlas...");
    const atlasConn = await mongoose.createConnection(atlasUri).asPromise();
    console.log("✅ Connected to MongoDB Atlas");

    // Define models on the connections
    const LocalUser = localConn.model("User", User.schema);
    const LocalDonor = localConn.model("Donor", Donor.schema);
    const LocalBloodRequest = localConn.model("BloodRequest", BloodRequest.schema);

    const AtlasUser = atlasConn.model("User", User.schema);
    const AtlasDonor = atlasConn.model("Donor", Donor.schema);
    const AtlasBloodRequest = atlasConn.model("BloodRequest", BloodRequest.schema);

    // 2. Migrate Users
    console.log("\n👤 Migrating Users...");
    const users = await LocalUser.find({});
    console.log(`Found ${users.length} users locally.`);
    if (users.length > 0) {
      await AtlasUser.insertMany(users.map(u => u.toObject()));
      console.log(`✅ Successfully migrated ${users.length} users.`);
    }

    // 3. Migrate Donors
    console.log("\n🩸 Migrating Donors...");
    const donors = await LocalDonor.find({});
    console.log(`Found ${donors.length} donors locally.`);
    if (donors.length > 0) {
      await AtlasDonor.insertMany(donors.map(d => d.toObject()));
      console.log(`✅ Successfully migrated ${donors.length} donors.`);
    }

    // 4. Migrate Blood Requests
    console.log("\n🆘 Migrating Blood Requests...");
    const requests = await LocalBloodRequest.find({});
    console.log(`Found ${requests.length} blood requests locally.`);
    if (requests.length > 0) {
      await AtlasBloodRequest.insertMany(requests.map(r => r.toObject()));
      console.log(`✅ Successfully migrated ${requests.length} blood requests.`);
    }

    console.log("\n✨ Migration Finished Successfully!");
    
    await localConn.close();
    await atlasConn.close();
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Migration Failed!");
    console.error(error);
    
    if (error.code === 'ECONNREFUSED' || error.syscall === 'querySrv') {
        console.error("\n💡 FIX: This error is likely because your IP is not whitelisted in Atlas or your network is blocking the connection.");
    }
    
    process.exit(1);
  }
}

migrate();
