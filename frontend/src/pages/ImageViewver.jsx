// src/pages/ImageViewer.jsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ImageViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const url = searchParams.get('imageUrl');
    if (url) {
      setImageUrl(url);

      // 🔽 Guarda la imagen en localStorage para que Navbar la use
      localStorage.setItem('lastImageUrl', url);
    }
  }, [searchParams]);

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
        <h1 className="text-2xl font-bold mb-4">No hay imagen para visualizar</h1>
        <p className="mb-6">Asegúrate de que N8N haya enviado una imagen válida.</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Vista Previa de Imagen</h1>
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-4xl">
        <img
          src={imageUrl}
          alt="Vista previa"
          className="max-w-full max-h-[80vh] mx-auto rounded-lg shadow"
        />
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
