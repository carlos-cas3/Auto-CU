import UploadButton from "../components/Buttons/UploadButton";
import ToggleButton from "../components/Buttons/ToggleButton";
import ViewUploadedButton from "../components/Buttons/ViewUploadedButton";
import SelectedFilesModal from "../components/FileList/SelectedFilesModal";
import UploadedFilesModal from "../components/FileList/UploadedFilesModal";
import FileInput from "../components/FileInput/FileInput";
import { useStartLogic } from "./useStartLogic";


const Start = () => {
    const {
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
  } = useStartLogic();

    return (
        <div className="bg-gray-600 min-h-screen flex justify-center items-center">
            <div className="bg-white p-20 rounded-2xl text-center flex flex-col">
                <form onSubmit={enviarArchivo}>
                    <div className="flex flex-col items-center gap-5 ">
                        <FileInput
                            onChange={manejarArchivo}
                            inputRef={inputRef}
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
