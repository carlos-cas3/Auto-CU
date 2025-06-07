import { useEffect, useState } from "react";
import UploadButton from "../Buttons/UploadButton";

const SelectedFilesList = ({ archivos, onRemove, onUpload, uploading }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const archivosPorPagina = 5;

    const totalPaginas = Math.ceil(archivos.length / archivosPorPagina);

    useEffect(() => {
        if (
            paginaActual > 1 &&
            archivos.length <= (paginaActual - 1) * archivosPorPagina
        ) {
            setPaginaActual((prev) => prev - 1);
        }
    }, [archivos, paginaActual]);

    const inicio = (paginaActual - 1) * archivosPorPagina;
    const archivosPagina = archivos.slice(inicio, inicio + archivosPorPagina);

    return (
        <div className="bg-white border border-gray-400 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Archivos seleccionados</h3>
            {archivos.length === 0 ? (
                <p className="text-gray-500">No hay archivos seleccionados.</p>
            ) : (
                <>
                    <ul className="space-y-2">
                        {archivosPagina.map((archivo, idx) => (
                            <li
                                key={inicio + idx}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                            >
                                <span className="truncate max-w-[70%]">{archivo.name}</span>
                                <button
                                    onClick={() => onRemove(inicio + idx)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            <button
                                onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
                                disabled={paginaActual === 1}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-2 py-1 text-sm">
                                Página {paginaActual} de {totalPaginas}
                            </span>
                            <button
                                onClick={() =>
                                    setPaginaActual((prev) =>
                                        Math.min(totalPaginas, prev + 1)
                                    )
                                }
                                disabled={paginaActual === totalPaginas}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}

                    {/* Botón subir */}
                    <div className="flex justify-center mt-4">
                        <UploadButton
                            onClick={onUpload}
                            disabled={uploading}
                            uploading={uploading}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SelectedFilesList;
