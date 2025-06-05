import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

const Start = () => {
    const inputRef = useRef();
    const [archivos, setArchivos] = useState([]);

    const [subiendo, setSubiendo] = useState(false);

    const [mostrarSeleccionados, setMostrarSeleccionados] = useState(false);

    const manejarArchivo = (e) => {
        const nuevos = Array.from(e.target.files);
        setArchivos((prev) => {
            const nombresPrevios = new Set(prev.map((a) => a.name));
            const nuevosSinDuplicar = nuevos.filter(
                (a) => !nombresPrevios.has(a.name)
            );
            return [...prev, ...nuevosSinDuplicar];
        });

        // Limpiar el input para permitir volver a subir el mismo archivo
        e.target.value = "";
    };

    const eliminarArchivo = (index) => {
        setArchivos((prev) => prev.filter((_, i) => i !== index));
    };

    const enviarArchivo = async (e) => {
        e.preventDefault();

        if (archivos.length === 0) {
            toast.error("Selecciona al menos un archivo.");
            return;
        }

        const formData = new FormData();
        archivos.forEach((archivo) => {
            formData.append("files", archivo); // Ajusta según cómo el backend los reciba
        });

        setSubiendo(true);
        try {
            const respuesta = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            const resultado = await respuesta.text();
            if (respuesta.ok) {
                toast.success("Archivos subidos correctamente.");
                setArchivosSubidos((prev) => [
                    ...prev,
                    ...archivos.map((a) => a.name),
                ]);
                setArchivos([]); // Limpia los archivos seleccionados
            } else {
                toast.error(`Error: ${resultado}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al enviar los archivos.");
        } finally {
            setSubiendo(false);
        }
    };

    const [archivosSubidos, setArchivosSubidos] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);

    return (
        <div className="bg-gray-600 min-h-screen flex justify-center items-center">
            <div className="bg-white p-20 rounded-2xl text-center flex flex-col">
                <form onSubmit={enviarArchivo}>
                    <div className="flex flex-col items-center gap-5">
                        <label
                            htmlFor="archivo"
                            className="bg-amber-400 hover:bg-amber-500 font-semibold py-2 px-4 rounded-full cursor-pointer transition-colors duration-300"
                        >
                            Seleccionar archivo
                        </label>
                        <input
                            id="archivo"
                            type="file"
                            multiple
                            onChange={manejarArchivo}
                            accept=".txt,.json,.csv"
                            ref={inputRef}
                            className="hidden"
                        />

                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 font-bold py-2 px-6 rounded-full disabled:opacity-50 cursor-pointer transition-colors duration-300"
                            disabled={subiendo}
                        >
                            {subiendo ? "Subiendo..." : "Subir archivo"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setMostrarSeleccionados(!mostrarSeleccionados)
                            }
                            className={`bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
                                archivos.length === 0
                                    ? "opacity-50 cursor-not-allowed hover:bg-purple-500"
                                    : ""
                            }`}
                            disabled={archivos.length === 0}
                        >
                            {mostrarSeleccionados
                                ? "Ocultar archivos seleccionados"
                                : "Ver archivos seleccionados"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                archivosSubidos.length > 0 &&
                                setMostrarLista(!mostrarLista)
                            }
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
                                archivosSubidos.length === 0
                                    ? "opacity-50 cursor-not-allowed hover:bg-blue-500"
                                    : ""
                            }`}
                            disabled={archivosSubidos.length === 0}
                        >
                            {mostrarLista
                                ? "Ocultar archivos"
                                : "Ver archivos subidos"}
                        </button>
                    </div>
                </form>
                {mostrarSeleccionados && archivos.length > 0 && (
                    <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                Archivos seleccionados
                            </h2>
                            <ul className="text-sm text-gray-800 list-disc pl-4 space-y-1">
                                {archivos.map((archivo, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center"
                                    >
                                        <div>
                                            <strong>{archivo.name}</strong> -{" "}
                                            {(archivo.size / 1024).toFixed(2)}{" "}
                                            KB
                                        </div>
                                        <button
                                            onClick={() =>
                                                eliminarArchivo(index)
                                            }
                                            className="ml-4 bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                        >
                                            Quitar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 text-right">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded"
                                    onClick={() =>
                                        setMostrarSeleccionados(false)
                                    }
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mostrarLista && archivosSubidos.length > 0 && (
                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
                                Archivos subidos
                            </h2>
                            <ul className="text-sm text-gray-800 list-disc pl-4 space-y-1">
                                {archivosSubidos.map((nombreArchivo, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="truncate max-w-xs">
                                            {nombreArchivo}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 text-right">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
                                    onClick={() => setMostrarLista(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Start;
