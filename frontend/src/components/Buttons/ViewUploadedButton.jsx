import { BUTTON_LABELS } from "../../constants/messages";

const ViewUploadedButton = ({ onClick, mostrar, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 ${
            disabled ? "opacity-50 cursor-not-allowed hover:bg-blue-500" : ""
        }`}
        disabled={disabled}
    >
        {mostrar ? BUTTON_LABELS.HIDE_UPLOADED : BUTTON_LABELS.VIEW_UPLOADED}
    </button>
);

export default ViewUploadedButton;
