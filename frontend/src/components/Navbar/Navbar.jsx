import { useNavigate } from 'react-router-dom';
import navLinks from '../../constants/navLinks';

const Navbar = () => {
  const navigate = useNavigate();


const handleViewClick = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/n8n/last-id");
    const data = await res.json();

    if (!data.id) {
      alert("⚠️ No hay ningún diagrama disponible para visualizar.");
      return;
    }

    console.log("🚀 Navegando a:", `/view?id=${data.id}`);
    navigate(`/view?id=${data.id}`);
  } catch (error) {
    console.error("❌ Error al obtener el último ID:", error);
    alert("Error al intentar consultar la imagen más reciente.");
  }
};


  return (
    <nav className='p-4 pl-60 pr-60 bg-gray-400'>
      <div className="flex justify-around text-xl">
        {navLinks.map((link, index) => {
          const Icon = link.icon;
          const isVerImagenes = link.name === "Ver Imágenes";

          return isVerImagenes ? (
            <button
              key={index}

              onClick={handleViewClick}
              className="p-5 bg-blue-200 hover:bg-blue-400 rounded-3xl flex items-center gap-2"
            >
              {Icon && <Icon size={20} />}
              {link.name}
            </button>
          ) : (
            <a
              key={index}
              href={link.path}
              className="p-5 bg-blue-200 hover:bg-blue-400 rounded-3xl flex items-center gap-2"
            >
              {Icon && <Icon size={20} />}
              {link.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
