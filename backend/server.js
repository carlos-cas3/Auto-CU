const express = require("express");
const cors = require("cors");
require("dotenv").config();
const uploadRoutes = require("./routes/upload.routes");
const { loadEnv } = require("./config");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", uploadRoutes);

loadEnv(); // Validación de variables de entorno

app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
