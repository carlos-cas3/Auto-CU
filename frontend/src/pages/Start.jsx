import UploadButton from "../components/Buttons/UploadButton";
import ToggleButton from "../components/Buttons/ToggleButton";
import ViewUploadedButton from "../components/Buttons/ViewUploadedButton";
import SelectedFilesList from "../components/FileList/SelectedFilesList";
import UploadedFilesModal from "../components/FileList/UploadedFilesModal";
import FileInput from "../components/FileInput/FileInput";
import { useStartLogic } from "../hooks/useStartLogic";
import { FaUpload, FaHistory } from "react-icons/fa";
import { useRef } from "react";
import UploadedFilesPanel from "../components/FileList/UploadedFilesPanel";

const Start = () => {
    const fileInputComponentRef = useRef();

    const {
        inputRef,
        archivos,
        archivosSubidos,
        subiendo,
        mostrarLista,
        manejarArchivo,
        eliminarArchivo,
        enviarArchivo,
        setMostrarLista,
    } = useStartLogic();

    const enviarYResetear = async () => {
        const ok = await enviarArchivo(); // sin evento e
        if (ok) {
            fileInputComponentRef.current?.reset();
        }
    };

    return (
        <div className="bg-gray-600 min-h-screen flex justify-center items-start">
            <div className="bg-white rounded-2xl flex flex-col p-5 gap-5 m-5">

                <div className="flex flex-col gap-5 ">
                    <div className="bg-gray-400 p-5 flex flex-col gap-3 rounded-xl">
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <FaUpload />
                            <h2>Subir archivos</h2>
                        </div>
                        <p>Selecciona uno o varios archivos para subir</p>

                        <FileInput
                            onChange={manejarArchivo}
                            inputRef={inputRef}
                            ref={fileInputComponentRef}
                            selectedFileCount={archivos.length}
                        />

                        {archivos.length > 0 && (
                            <SelectedFilesList
                                archivos={archivos}
                                onRemove={eliminarArchivo}
                                onUpload={enviarYResetear}
                                uploading={subiendo}
                            />
                        )}
                    </div>

                    <div className="bg-blue-400 p-5 flex flex-col gap-3 rounded-xl">
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <FaHistory />
                            <h2>Historial de archivos subidos</h2>
                        </div>
                        <p>Metadatos de los archivos enviados</p>
                        <ViewUploadedButton
                            onClick={() => setMostrarLista(!mostrarLista)}
                            mostrar={mostrarLista}
                            disabled={archivosSubidos.length === 0}
                        />
                    </div>
                    {mostrarLista && archivosSubidos.length > 0 && (
                        <UploadedFilesPanel archivos={archivosSubidos} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Start;
