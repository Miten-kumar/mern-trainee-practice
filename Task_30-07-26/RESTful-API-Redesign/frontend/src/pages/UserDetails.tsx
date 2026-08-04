import {
    useParams,
    useNavigate
} from "react-router-dom";


import {
    useUserById
} from "../hooks/useUsers";


import Loader
from "../components/Loder";


import ErrorMessage
from "../components/ErrorMessage";


import "../style/users.css";





const UserDetails = () => {


    const { id } = useParams();



    const navigate = useNavigate();




    const {
        data,
        isLoading,
        error

    } = useUserById(
        Number(id)
    );





    if(isLoading)

        return <Loader/>;





    if(error)

        return (

            <ErrorMessage

                message="Unable to load user"

            />

        );





    const user = data?.data;





    return (

        <div className="details-container">



            <div className="details-card">



                <h1 className="details-title">

                    User Details

                </h1>





                <div className="details-info">


                    <div>

                        <h3>ID</h3>

                        <p>{user?.id}</p>

                    </div>




                    <div>

                        <h3>Name</h3>

                        <p>{user?.name}</p>

                    </div>





                    <div>

                        <h3>Email</h3>

                        <p>{user?.email}</p>

                    </div>



                </div>






                <h3 className="actions-title">

                    Available Actions

                </h3>





                <div className="hateoas-container">


                    {

                    user?._links?.map(

                    (link,index)=>(


                        <div

                            className="hateoas-link"

                            key={index}

                        >



                            <button

                                className="btn btn-view"

                                onClick={()=>{


                                    if(link.rel==="update"){


                                        navigate(

                                            `/users/edit/${user.id}`

                                        );

                                    }



                                    if(link.rel==="delete"){


                                        console.log(

                                            "Delete API:",

                                            link.href

                                        );

                                    }



                                }}

                            >


                                {link.method}

                                &nbsp;

                                {link.rel}



                            </button>





                            <span className="link-url">


                                {link.href}


                            </span>




                        </div>


                    )

                    )

                    }


                </div>



            </div>


        </div>

    );


};



export default UserDetails;