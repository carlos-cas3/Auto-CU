// src/components/Navbar/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import navLinks from '../../constants/navLinks';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);

  // Cargar imageUrl desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedUrl = localStorage.getItem('lastImageUrl');
    if (storedUrl) {
      setImageUrl(storedUrl);
    }
  }, []);

  const handleViewClick = () => {
    if (imageUrl) {
      navigate(`/view?imageUrl=${encodeURIComponent(imageUrl)}`);
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
