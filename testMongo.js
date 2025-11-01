const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;

async function testMongo() {
  try {
    console.log("Intentando conectar a MongoDB...");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conexión exitosa a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexión cerrada");
  }
}

testMongo();
