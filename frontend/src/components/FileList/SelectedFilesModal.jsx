import { formatearTamano } from "../../utils/fileUtils";
const SelectedFilesModal = ({ archivos, onClose, onRemove }) => {
    return (
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
                                {formatearTamano(archivo.size)}
                            </div>

                            <button
                                onClick={() => onRemove(index)}
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
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectedFilesModal;
