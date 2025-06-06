const UploadButton = ({ onClick, disabled, uploading }) => (
    <button
        type="submit"
        onClick={onClick}
        disabled={disabled}
        className="bg-amber-500 hover:bg-amber-600 font-bold py-2 px-6 rounded-full disabled:opacity-50 cursor-pointer transition-colors duration-300"
    >
        {uploading ? "Subiendo..." : "Subir archivo"}
    </button>
);

export default UploadButton;
