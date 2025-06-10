import  navLinks  from '../../constants/navLinks';

const Navbar = () => {
    return (
        <nav>
            <div className="bg-pink-300 p-5">
                {navLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.path}
                        className="text-white hover:text-gray-200 mx-2"
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;
