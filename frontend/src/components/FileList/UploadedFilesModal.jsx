const UploadedFilesModal = ({ archivos , onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
                                Archivos subidos
                            </h2>
                            <ul className="text-sm text-gray-800 list-disc pl-4 space-y-1">
                                {archivos.map((nombreArchivo, index) => (
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
                                    onClick={onClose}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
    )
}

export default UploadedFilesModal;