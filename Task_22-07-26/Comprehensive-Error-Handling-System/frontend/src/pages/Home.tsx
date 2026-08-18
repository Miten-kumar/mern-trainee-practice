import { Link } from "react-router-dom";
import "../style/Home.css";


const Home = () => {


    return (

        <div className="home-container">


            <div className="home-content">


                <h1 className="home-title">

                    Comprehensive Error Handling System

                </h1>


                <p className="home-description">

                    React + TypeScript + Express + PostgreSQL

                </p>



                <div className="home-buttons">


                    <Link to="/users">

                        <button className="home-btn">

                            Go To Users

                        </button>

                    </Link>



                    <Link to="/dashboard">

                        <button className="home-btn">

                            Go To Dashboard

                        </button>

                    </Link>


                </div>


            </div>


        </div>

    );


};


export default Home;