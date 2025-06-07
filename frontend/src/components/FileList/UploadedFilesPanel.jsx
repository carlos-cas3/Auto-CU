const UploadedFilesPanel = ({ archivos }) => {
    return (
        <div className="bg-green-400 p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
                Archivos subidos
            </h2>

            <ul className="flex flex-col gap-4 text-sm text-gray-800 max-h-96 overflow-y-auto pr-2">
                {archivos.map((archivo, index) => (
                    <li
                        key={index}
                        className="bg-gray-100 p-4 rounded-lg shadow-sm"
                    >
                        <p className="font-semibold break-words">{archivo.name}</p>
                        <p><span className="font-medium">Tipo:</span> {archivo.type || "unknown"}</p>
                        <p>
                            <span className="font-medium">Tamaño:</span>{" "}
                            {(archivo.size / 1024).toFixed(2)} KB
                        </p>
                        <p>
                            <span className="font-medium">Fecha:</span>{" "}
                            {archivo.lastModified
                                ? new Date(archivo.lastModified).toLocaleString()
                                : "Desconocida"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UploadedFilesPanel;
