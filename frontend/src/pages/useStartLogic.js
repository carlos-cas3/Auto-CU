// src/hooks/useStartLogic.js
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadFiles } from "../services/uploadFiles";
import { filtrarArchivosDuplicados } from "../utils/fileUtils";
import { TOAST_MESSAGES } from "../constants/messages";

export const useStartLogic = () => {
    const inputRef = useRef();
    const [archivos, setArchivos] = useState([]);
    const [archivosSubidos, setArchivosSubidos] = useState([]);
    const [subiendo, setSubiendo] = useState(false);
    const [mostrarSeleccionados, setMostrarSeleccionados] = useState(false);
    const [mostrarLista, setMostrarLista] = useState(false);

    const manejarArchivo = (e) => {
        const nuevos = Array.from(e.target.files);
        setArchivos((prev) => [
            ...prev,
            ...filtrarArchivosDuplicados(prev, nuevos),
        ]);
        e.target.value = "";
    };

    const eliminarArchivo = (index) => {
        setArchivos((prev) => prev.filter((_, i) => i !== index));
    };

    const enviarArchivo = async (e) => {
        e.preventDefault();

        if (archivos.length === 0) {
            toast.error(TOAST_MESSAGES.NO_FILES_SELECTED);
            return;
        }

        setSubiendo(true);

        try {
            const respuesta = await uploadFiles(archivos);

            if (respuesta.ok) {
                toast.success(TOAST_MESSAGES.UPLOAD_SUCCESS);
                setArchivosSubidos((prev) => [
                    ...prev,
                    ...archivos.map((a) => a.name),
                ]);
                setArchivos([]);
            } else {
                toast.error(respuesta.error || TOAST_MESSAGES.UPLOAD_ERROR);
            }
        } catch (error) {
            console.error(error);
            toast.error(TOAST_MESSAGES.UPLOAD_ERROR);
        } finally {
            setSubiendo(false);
        }
    };

    return {
        inputRef,
        archivos,
        archivosSubidos,
        subiendo,
        mostrarSeleccionados,
        mostrarLista,
        manejarArchivo,
        eliminarArchivo,
        enviarArchivo,
        setMostrarSeleccionados,
        setMostrarLista,
    };
};
