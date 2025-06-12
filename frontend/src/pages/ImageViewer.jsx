import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ZoomableImage from "../components/UI/ZoomableImage.jsx"; // Ajusta el path si es necesario

const ImageViewer = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("🧪 ImageViewer montado");

    useEffect(() => {
        const id = searchParams.get("id");
        console.log("🧭 ID recibido de la URL:", id);

        if (!id) {
            console.warn("⚠️ No se recibió ningún ID.");
            setLoading(false);
            return;
        }

        const fetchImageUrl = async () => {
            try {
                console.log("🔄 Llamando al backend con ID:", id);
                const response = await axios.get(
                    `http://localhost:5000/api/n8n/image-url/${id}`
                );
                console.log("✅ Respuesta recibida:", response.data);

                const url = response.data.imageUrl;

                if (url) {
                    setImageUrl(url);
                } else {
                    console.warn("⚠️ No se recibió imageUrl válido.");
                }
            } catch (err) {
                console.error("❌ Error al obtener la imagen:", err);
                alert("No se pudo obtener la imagen.");
            } finally {
                setLoading(false);
            }
        };

        fetchImageUrl();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700">
                <p className="text-xl">Cargando imagen...</p>
            </div>
        );
    }

    if (!imageUrl) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
                <h1 className="text-2xl font-bold mb-4">
                    No hay imagen para visualizar
                </h1>
                <p className="mb-6">
                    Asegúrate de que N8N haya generado correctamente el recurso.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Volver atrás
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-300 flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Vista Previa de Imagen
            </h1>

            <div className="bg-red-500 border border-gray-200 rounded-3xl shadow-md p-6 w-full max-w-6xl">
                <ZoomableImage src={imageUrl} alt="Vista previa" />

                <div className="flex justify-center mt-6">
                    <a
                        href={imageUrl}
                        download
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
                    >
                        Descargar Imagen
                    </a>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;
