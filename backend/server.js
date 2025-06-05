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
console.log("📦 N8N_WEBHOOK_URL cargado:", N8N_WEBHOOK_URL);
if (!N8N_WEBHOOK_URL) {
    console.error(
        "❌ N8N_WEBHOOK_URL no está definido en las variables de entorno."
    );
    process.exit(1);
}

app.post("/api/upload", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No se proporcionaron archivos.");
  }

  const form = new FormData();

  try {
    // Adjunta todos los archivos
    for (const archivo of req.files) {
      const filePath = archivo.path;
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
        continue;
      }

      form.append("file", fs.createReadStream(filePath), archivo.originalname);
    }

    // Envío a n8n
    await axios.post(N8N_WEBHOOK_URL, form, {
      headers: form.getHeaders(),
    });

    // Borra los archivos subidos localmente
    for (const archivo of req.files) {
      try {
        fs.unlinkSync(archivo.path);
      } catch (err) {
        console.warn(`⚠️ No se pudo borrar ${archivo.path}:`, err.message);
      }
    }

    console.log("✅ Todos los archivos fueron enviados correctamente a n8n.");
    return res.status(200).send("Todos los archivos fueron enviados correctamente a n8n.");

  } catch (error) {
    console.error("❌ Error al enviar archivos:", error.message);

    // Borra aunque haya fallo
    for (const archivo of req.files) {
      try {
        if (fs.existsSync(archivo.path)) {
          fs.unlinkSync(archivo.path);
        }
      } catch (err) {
        console.warn(`⚠️ No se pudo borrar ${archivo.path}:`, err.message);
      }
    }

    // Solo una respuesta
    if (!res.headersSent) {
      return res.status(500).send("Error al enviar archivos a n8n.");
    }
  }
});


app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
