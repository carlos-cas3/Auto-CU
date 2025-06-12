import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useRef } from 'react';

const ZoomableImage = ({ src, alt = 'Vista previa' }) => {
  const transformRef = useRef(null);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Botones arriba */}
      <div className="flex justify-center gap-4 p-4 bg-gray-100 shadow z-10">
        <button
          onClick={() => transformRef.current?.zoomIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Acercar
        </button>
        <button
          onClick={() => transformRef.current?.zoomOut()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Alejar
        </button>
        <button
          onClick={() => transformRef.current?.resetTransform()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Reiniciar
        </button>
      </div>

      {/* Contenedor con scroll */}
      <div className="flex-1 overflow-auto bg-white border rounded shadow m-4">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.2}
          maxScale={5}
          centerZoomed
        >
          <TransformComponent>
            <div className="flex justify-center items-start p-8">
              <img
                src={src}
                alt={alt}
                className="block"
                style={{ maxWidth: 'none', maxHeight: 'none' }}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ZoomableImage;
