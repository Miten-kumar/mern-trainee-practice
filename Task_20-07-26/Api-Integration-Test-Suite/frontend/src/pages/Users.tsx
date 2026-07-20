import {
  useEffect,
  useState,
} from "react";

import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

import { userService } from "../services/user.service";

import { User } from "../types/user.types";


const Users = () => {

  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);


  const [loading, setLoading] =
    useState(false);



  const fetchUsers = async () => {

    try {

      setLoading(true);

      const data =
        await userService.getUsers();

      setUsers(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };



  useEffect(() => {

    fetchUsers();

  }, []);




  const handleCreateOrUpdate =
    async (
      data: Omit<User, "id">
    ) => {

    try {

      if(selectedUser){

        await userService.updateUser(
          selectedUser.id,
          data
        );

      }
      else{

        await userService.createUser(
          data
        );

      }


      setSelectedUser(null);

      fetchUsers();


    } catch(error){

      console.log(error);

    }

  };




  const handleDelete =
    async (
      id:number
    ) => {

    try{

      await userService.deleteUser(id);

      fetchUsers();

    }
    catch(error){

      console.log(error);

    }

  };




  return (

    <div className="users-page">


      <h1 className="users-title">
        Users Management
      </h1>



      <div className="user-form-container">


        <UserForm
          initialData={selectedUser}

          onSubmit={handleCreateOrUpdate}

          onCancel={() =>
            setSelectedUser(null)
          }

        />


      </div>





      <div className="user-list-container">


      {
        loading ? (

          <p className="loading-text">
            Loading users...
          </p>

        ) : (

          <UserList

            users={users}

            onEdit={(user)=> 
              setSelectedUser(user)
            }

            onDelete={handleDelete}

          />

        )
      }


      </div>




    </div>

  );

};


export default Users;