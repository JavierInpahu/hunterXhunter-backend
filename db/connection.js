const mongoose = require("mongoose");
const mysql = require("mysql2/promise");
require("dotenv").config();

const conectarMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
};

const conectarMySQL = async () => {
  try {
    const conexion = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
    });
    console.log("Conexión exitosa a MySQL");
    return conexion;
  } catch (error) {
    console.error("Error conectando a MySQL:", error);
  }
};

module.exports = { conectarMongo, conectarMySQL };
