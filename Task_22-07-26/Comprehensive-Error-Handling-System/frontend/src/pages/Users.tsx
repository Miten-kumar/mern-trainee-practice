import { useEffect, useState } from "react";
import { getUsers } from "../services/user.service";
import Loading from "../components/Loading";
import NetworkError from "../components/NetworkError";
import useNetworkStatus from "../hooks/useNetworkStatus";
import useRetry from "../hooks/useRetry";
import "../style/Users.css";


interface User {

    id: number;

    name: string;

    email: string;

}

const Users = () => {

    const [users, setUsers] =
        useState<User[]>([]);

    const {
        isOnline
    } = useNetworkStatus();

    const {

        executeRetry,

        loading,

        error

    } = useRetry();

   const fetchUsers = async () => {

    try {

        const response =
            await executeRetry(
                () => getUsers()
            );


        console.log("API Response:", response);


        if (!response) {

            setUsers([]);

            return;

        }


        setUsers(
            response.data ?? []
        );


    } catch (error) {

        console.log(error);

    }

};
    useEffect(() => {

        if (!isOnline) return;
        const loadUsers = async () => {

            await fetchUsers();

        };

        loadUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline]);

    if (!isOnline) {

        return (
            <NetworkError
                onRetry={fetchUsers}

            />

        );

    }

    if (loading) {
        return <Loading />;

    }

    return (

        <div className="users-container">

            <h1 className="users-title">

                Users

            </h1>

            {
                error &&

                <p className="users-error">

                    Failed to load users

                </p>

            }

            <button

                className="retry-btn"

                onClick={fetchUsers}

            >
                Retry

            </button>

            <ul className="users-list">

                {
                    users.map(user => (

                        <li

                        className="user-card"

                            key={user.id}

                        >

                           <h3>

                                {user.name}

                            </h3>

                            <p>

                                {user.email}

                            </p>

                        </li>

                    ))

                }

            </ul>

        </div>

    );

};

export default Users;