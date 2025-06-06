// components/Buttons/ViewUploadedButton.jsx
import React from "react";

const ViewUploadedButton = ({ onClick, mostrar, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
            disabled ? "opacity-50 cursor-not-allowed hover:bg-blue-500" : ""
        }`}
        disabled={disabled}
    >
        {mostrar ? "Ocultar archivos" : "Ver archivos subidos"}
    </button>
);

export default ViewUploadedButton;
