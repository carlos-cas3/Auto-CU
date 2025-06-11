// src/constants/navLinks.js
import { FaFileImport, FaImage } from "react-icons/fa";

const navLinks = [
  {
    name: 'Gestor de Archivos',
    path: '/',
    icon: FaFileImport,
  },
  {
    name: 'Ver Imágenes',
    // Ya no usaremos esta propiedad `path` directamente para este link.
    path: '', // ← puede estar vacío o eliminada si lo prefieres
    icon: FaImage,
  },
];

export default navLinks;
