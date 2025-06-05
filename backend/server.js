const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

app.post("/api/upload", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No se proporcionaron archivos.");
    }

    const errores = [];
    for (const archivo of req.files) {
      const form = new FormData();
      form.append("file", fs.createReadStream(archivo.path), archivo.originalname);

      try {
        await axios.post(N8N_WEBHOOK_URL, form, {
          headers: form.getHeaders(),
        });
        fs.unlinkSync(archivo.path); // Borra archivo temporal tras envío
      } catch (error) {
        console.error(`❌ Error al enviar ${archivo.originalname}:`, error.message);
        errores.push(archivo.originalname);
        // También podrías dejar el archivo sin borrar si lo deseas
        fs.unlinkSync(archivo.path);
      }
    }

    if (errores.length > 0) {
      return res.status(207).send(
        `Algunos archivos fallaron: ${errores.join(", ")}. Los demás fueron enviados correctamente.`
      );
    }

    res.status(200).send("Todos los archivos fueron enviados correctamente a n8n.");
  } catch (error) {
    console.error("❌ Error general:", error.message);
    res.status(500).send("Error interno al procesar los archivos.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
