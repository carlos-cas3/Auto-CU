// src/components/Navbar/Navbar.jsx
import navLinks from '../../constants/navLinks';

const Navbar = () => {
    return (
        <nav className='p-4 pl-60 pr-60 bg-gray-400'>
            <div className="flex justify-around text-xl">
                {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
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
