// Ejemplo en tu componente del navbar
import { useNavigate } from 'react-router-dom';

const VerImagenesButton = ({ imageUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (imageUrl) {
      navigate(`/view?imageUrl=${encodeURIComponent(imageUrl)}`);
    }
  };

  return (
    <button onClick={handleClick} className="text-white px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
      Ver Imagenes
    </button>
  );
};

export default VerImagenesButton;
