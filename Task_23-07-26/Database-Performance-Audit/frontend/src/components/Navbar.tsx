import { Link } from "react-router-dom";
import "../style/Navbar.css";


function Navbar(){

    return (

        <nav className="navbar">

            <h2>
                Database Audit
            </h2>


            <div className="nav-links">

                <Link to="/">
                    Dashboard
                </Link>


                <Link to="/users">
                    Users
                </Link>

            </div>


        </nav>

    );

}

export default Navbar;