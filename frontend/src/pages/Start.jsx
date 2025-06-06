import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import UploadButton from "../components/Buttons/UploadButton";
import ToggleButton from "../components/Buttons/ToggleButton";
import ViewUploadedButton from "../components/Buttons/ViewUploadedButton";
import SelectedFilesModal from "../components/FileList/SelectedFilesModal";
import UploadedFilesModal from "../components/FileList/UploadedFilesModal";

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
                            accept=".docx,.pdf,.csv,.xlsx"
                            ref={inputRef}
                            className="hidden"
                        />

                        <UploadButton
                            onClick={enviarArchivo}
                            disabled={subiendo}
                            uploading={subiendo}
                        />

                        <ToggleButton
                            onClick={() =>
                                setMostrarSeleccionados(!mostrarSeleccionados)
                            }
                            mostrar={mostrarSeleccionados}
                            disabled={archivos.length === 0}
                        />

                        <ViewUploadedButton
                            onClick={() => setMostrarLista(!mostrarLista)}
                            mostrar={mostrarLista}
                            disabled={archivosSubidos.length === 0}
                        />
                    </div>
                </form>
                {mostrarSeleccionados && archivos.length > 0 && (
                    <SelectedFilesModal
                        archivos={archivos}
                        onClose={() => setMostrarSeleccionados(false)}
                        onRemove={eliminarArchivo}
                    />
                )}

                {mostrarLista && archivosSubidos.length > 0 && (
                    <UploadedFilesModal
                        archivos={archivosSubidos}
                        onClose={() => setMostrarLista(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Start;
