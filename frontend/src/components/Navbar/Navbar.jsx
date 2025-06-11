// src/components/Navbar/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import navLinks from '../../constants/navLinks';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [lastImageId, setLastImageId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('lastImageId');
    if (storedId) {
      setLastImageId(storedId);
    }
  }, []);

  const handleViewClick = () => {
    if (lastImageId) {
      navigate(`/view?id=${lastImageId}`);
    } else {
      alert('No hay imagen disponible para visualizar.');
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
