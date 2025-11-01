const express = require("express");
const cors = require("cors");
const { conectarMongo, conectarMySQL } = require("./db/connection");
const { CazadorMongo, sincronizarMySQL } = require("./models/cazador");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Hunter X Hunter",
      version: "1.0.0",
      description: "API REST creada con Node.js, Express, MongoDB Atlas y MySQL.",
      contact: {
        name: "Oscar Javier Ramírez",
        email: "0808javierramirez88@example.com",
      },
    },
    servers: [
      { url: "http://localhost:3000", description: "Servidor local" },
    ],
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta raíz simple para probar
app.get("/", (req, res) => {
  res.send("API Hunter X Hunter funcionando");
});

/**
 * @swagger
 * /cazadores:
 *   get:
 *     summary: Obtiene todos los cazadores de MongoDB
 *     responses:
 *       200:
 *         description: Lista de cazadores
 */
app.get("/cazadores", async (req, res) => {
  try {
    const cazadores = await CazadorMongo.find();
    res.json(cazadores);
  } catch {
    res.status(500).json({ error: "Error al obtener los cazadores" });
  }
});

/**
 * @swagger
 * /cazadores/{nombre}:
 *   get:
 *     summary: Busca un cazador por nombre en MongoDB
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del cazador a buscar
 *     responses:
 *       200:
 *         description: Datos del cazador
 *       404:
 *         description: Cazador no encontrado
 */
app.get("/cazadores/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const regex = new RegExp(nombre, "i");
    const cazador = await CazadorMongo.findOne({ nombre: regex });
    if (!cazador) return res.status(404).json({ error: "Cazador no encontrado" });
    res.json(cazador);
  } catch {
    res.status(500).json({ error: "Error al buscar el cazador" });
  }
});

/**
 * @swagger
 * /cazadores:
 *   post:
 *     summary: Crea un nuevo cazador en MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: integer
 *               altura:
 *                 type: number
 *               peso:
 *                 type: number
 *               url_imagen:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cazador creado
 *       500:
 *         description: Error al crear el cazador
 */
app.post("/cazadores", async (req, res) => {
  try {
    const nuevo = new CazadorMongo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: "Error al crear el cazador" });
  }
});

/**
 * @swagger
 * /cazadores/{nombre}:
 *   put:
 *     summary: Actualiza un cazador por nombre en MongoDB
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del cazador a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cazador actualizado
 *       404:
 *         description: Cazador no encontrado
 *       500:
 *         description: Error al actualizar el cazador
 */
app.put("/cazadores/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const actualizado = await CazadorMongo.findOneAndUpdate(
      { nombre: new RegExp(nombre, "i") },
      req.body,
      { new: true }
    );
    if (!actualizado)
      return res.status(404).json({ error: "Cazador no encontrado" });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: "Error al actualizar el cazador" });
  }
});

/**
 * @swagger
 * /cazadores/{nombre}:
 *   delete:
 *     summary: Elimina un cazador por nombre en MongoDB
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del cazador a eliminar
 *     responses:
 *       200:
 *         description: Cazador eliminado correctamente
 *       404:
 *         description: Cazador no encontrado
 *       500:
 *         description: Error al eliminar el cazador
 */
app.delete("/cazadores/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const eliminado = await CazadorMongo.findOneAndDelete({
      nombre: new RegExp(nombre, "i"),
    });
    if (!eliminado)
      return res.status(404).json({ error: "Cazador no encontrado" });
    res.json({ mensaje: "Cazador eliminado correctamente" });
  } catch {
    res.status(500).json({ error: "Error al eliminar el cazador" });
  }
});

(async () => {
  try {
    await conectarMongo();
    await conectarMySQL();
    await sincronizarMySQL();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
})();
