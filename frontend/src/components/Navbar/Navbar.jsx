// src/components/Navbar/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import navLinks from '../../constants/navLinks';

const Navbar = () => {
  const navigate = useNavigate();

  // Puedes cambiar esto por una prop, o por un estado global
  const imageUrl = 'http://localhost:5000/imagenes/98379b02-1bbd-4b7e-be6e-470cda030d01.png';

  const handleViewClick = () => {
    if (imageUrl) {
      navigate(`/view?imageUrl=${encodeURIComponent(imageUrl)}`);
    }
  };

  return (
    <nav className='p-4 pl-60 pr-60 bg-gray-400'>
      <div className="flex justify-around text-xl">
        {navLinks.map((link, index) => {
          const Icon = link.icon;
          const isVerImagenes = link.name === "Ver Imagenes";

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
