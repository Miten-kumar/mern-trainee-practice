import { useUsers } from "../hooks/useUsers";

interface User {
    id: number;
    name: string;
    email: string;
}

const Home = () => {
    const users: User[] = useUsers();

    return (
        <div className="app">

            <div className="container">

                <div className="card">

                    <h2>Users - Database Table</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Home;