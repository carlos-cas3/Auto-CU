export const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
        return {
            ok: false,
            error: "No se proporcionaron archivos para subir.",
        };
    }

    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    try {
        const response = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: formData,
        });

        const text = await response.text(); // primero obtenemos el texto plano
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }

        if (!response.ok) {
            return {
                ok: false,
                error: data.message || "Error al subir archivos.",
            };
        }

        return {
            ok: true,
            data: data, // puede ser texto o JSON
        };
    } catch (error) {
        console.error("Upload error:", error);
        return {
            ok: false,
            error: "Ocurrió un error inesperado al subir los archivos.",
        };
    }
};
