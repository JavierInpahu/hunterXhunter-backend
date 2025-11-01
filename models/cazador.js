const mongoose = require("mongoose");
const { DataTypes, Sequelize } = require("sequelize");

const CazadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  altura: { type: Number, required: true },
  peso: { type: Number, required: true },
  url_imagen: { type: String, required: true },
});

// Usamos la colección "personajes" explícitamente:
const CazadorMongo = mongoose.model("Cazador", CazadorSchema, "personajes");

const sequelize = new Sequelize(
  process.env.MYSQL_DB || "hunterxhunter", // Tu base de datos MySQL
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASS || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

const CazadorMySQL = sequelize.define(
  "Cazador",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    edad: { type: DataTypes.INTEGER, allowNull: false },
    altura: { type: DataTypes.FLOAT, allowNull: false },
    peso: { type: DataTypes.FLOAT, allowNull: false },
    url_imagen: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "personajes", 
    timestamps: false,
  }
);

const sincronizarMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión MySQL OK");
    await CazadorMySQL.sync();
    console.log("Tabla 'personajes' sincronizada en MySQL");
  } catch (error) {
    console.error("Error sincronizando MySQL:", error);
  }
};

module.exports = { CazadorMongo, CazadorMySQL, sincronizarMySQL, sequelize };
