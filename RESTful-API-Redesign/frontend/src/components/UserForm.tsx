import {
    useState,
    useEffect
} from "react";

import type {
    User,
    CreateUserRequest
} from "../types/user.types";

import "../style/users.css";


interface Props {

    selectedUser?: User | null;

    onSubmit:
    (
        data: CreateUserRequest
    ) => void;


    onCancel:
    () => void;

}



const UserForm = ({

    selectedUser,

    onSubmit,

    onCancel

}: Props) => {


    const [form, setForm] =
    useState<CreateUserRequest>({

        name: "",

        email: ""

    });



    useEffect(() => {


        if(selectedUser){


            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({

                name: selectedUser.name,

                email: selectedUser.email

            });

        }


    }, [selectedUser]);





    const handleChange = (

        e: React.ChangeEvent<HTMLInputElement>

    ) => {


        setForm({

            ...form,

            [e.target.name]:

            e.target.value

        });


    };





    const handleSubmit = (

        e: React.FormEvent

    ) => {


        e.preventDefault();


        onSubmit(form);



        setForm({

            name: "",

            email: ""

        });


    };






    return (

        <form

            className="user-form"

            onSubmit={handleSubmit}

        >


            <h2 className="form-title">


                {

                selectedUser

                ?

                "Update User"

                :

                "Create User"

                }


            </h2>





            <input

                className="user-input"

                type="text"

                name="name"

                placeholder="Enter name"

                value={form.name}

                onChange={handleChange}

            />





            <input

                className="user-input"

                type="email"

                name="email"

                placeholder="Enter email"

                value={form.email}

                onChange={handleChange}

            />





            <div className="form-actions">


                <button

                    type="submit"

                    className="btn btn-primary"

                >


                    {

                    selectedUser

                    ?

                    "Update"

                    :

                    "Save"

                    }


                </button>





                {

                selectedUser &&


                <button

                    type="button"

                    className="btn btn-cancel"

                    onClick={onCancel}

                >

                    Cancel

                </button>


                }


            </div>



        </form>

    );

};


export default UserForm;