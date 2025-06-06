const FileInput = ({ onChange , inputRef }) => {
    return (
        <div>
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
                onChange={onChange}
                accept=".docx,.pdf,.csv,.xlsx"
                ref={inputRef}
                className="hidden"
            />
        </div>
    );
}

export default FileInput;