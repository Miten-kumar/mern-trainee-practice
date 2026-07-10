import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">

            <h2>
                Docker Full Stack App
            </h2>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/about">
                    About
                </Link>

            </div>

        </nav>
    );
};

export default Navbar;