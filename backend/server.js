require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { loadEnv } = require("./config");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const routes = require("./routes"); // Cargamos el index.js dentro de /routes
app.use("/api", routes);

loadEnv(); // Validación de variables de entorno

app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
