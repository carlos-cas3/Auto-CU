import { useImperativeHandle, forwardRef } from "react";

const FileInput = forwardRef(
    ({ onChange, inputRef, selectedFileCount }, ref) => {
        const getFileText = () => {
            if (selectedFileCount === 0) return "Sin archivo seleccionado";
            if (selectedFileCount === 1) return "1 archivo seleccionado";
            return `${selectedFileCount} archivos seleccionados`;
        };

        useImperativeHandle(ref, () => ({
            reset: () => {
                if (inputRef?.current) {
                    inputRef.current.value = "";
                }
            },
        }));

        return (
            <div className="flex p-3 bg-white rounded-xl items-center gap-5 w-full  ">
                <label
                    htmlFor="archivo"
                    className="bg-gray-400 hover:bg-gray-300 font-semibold px-4 py-3 rounded-xl cursor-pointer transition-colors duration-300 "
                >
                    Seleccionar archivo
                </label>

                <input
                    id="archivo"
                    type="file"
                    multiple
                    accept=".docx,.pdf,.csv,.xlsx"
                    onChange={onChange}
                    ref={inputRef}
                    className="hidden"
                />

                <span className="text-sm">{getFileText()}</span>
            </div>
        );
    }
);

export default FileInput;
