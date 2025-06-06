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

    const FormData = require("form-data");
    const form = new FormData();

    try {
        const archivosPorExtension = {};

        req.files.forEach((archivo) => {
            const filePath = archivo.path;

            if (!fs.existsSync(filePath)) {
                console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
                return;
            }

            const extension = archivo.originalname
                .split(".")
                .pop()
                .toLowerCase();
 
            if (!archivosPorExtension[extension]) {
                archivosPorExtension[extension] = [];
            }

            archivosPorExtension[extension].push(archivo.originalname);

            // Adjunta el archivo binario
            form.append(
                `file_${archivo.originalname}`,
                fs.createReadStream(filePath),
                archivo.originalname
            );
        });

        // ⚠️ Aquí el truco: añadir como texto plano, no archivo
        form.append(
            "archivosPorExtension",
            JSON.stringify(archivosPorExtension)
        );

        await axios.post(N8N_WEBHOOK_URL, form, {
            headers: form.getHeaders(),
        });

        req.files.forEach((archivo) => {
            try {
                fs.unlinkSync(archivo.path);
            } catch (err) {
                console.warn(
                    `⚠️ No se pudo borrar ${archivo.path}:`,
                    err.message
                );
            }
        });

        return res.status(200).send("Archivos y agrupación enviados a n8n.");
    } catch (error) {
        console.error("❌ Error al enviar archivos:", error.message);

        req.files.forEach((archivo) => {
            try {
                if (fs.existsSync(archivo.path)) {
                    fs.unlinkSync(archivo.path);
                }
            } catch (err) {
                console.warn(
                    `⚠️ No se pudo borrar ${archivo.path}:`,
                    err.message
                );
            }
        });

        if (!res.headersSent) {
            return res.status(500).send("Error al enviar archivos a n8n.");
        }
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
