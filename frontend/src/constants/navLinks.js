// src/constants/navLinks.js
import { FaFileImport, FaImage } from "react-icons/fa";
import { TbUserSearch } from "react-icons/tb";


const navLinks = [
    {
        name: "Gestor de Archivos",
        path: "/",
        icon: FaFileImport,
    },
    {
        name: "Ver Resultado por ID",
        path: "/story",
        icon: TbUserSearch,
    },
    /* {
        name: "Ver Imágenes",
        // Ya no usaremos esta propiedad `path` directamente para este link.
        path: "", // ← puede estar vacío o eliminada si lo prefieres
        icon: FaImage,
    }, */
];

export default navLinks;
