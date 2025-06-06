import { BUTTON_LABELS } from "../../constants/messages";

const ToggleButton = ({ onClick, disabled, mostrar }) => (
    <button
        type="button"
        onClick={onClick}
        className={`bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
            disabled ? "opacity-50 cursor-not-allowed hover:bg-purple-500" : ""
        }`}
        disabled={disabled}
    >
        {mostrar ? BUTTON_LABELS.HIDE_SELECTED : BUTTON_LABELS.VIEW_SELECTED}
    </button>
);

export default ToggleButton;
