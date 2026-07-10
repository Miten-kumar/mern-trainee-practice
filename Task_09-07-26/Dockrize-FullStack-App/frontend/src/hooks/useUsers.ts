import { useEffect, useState } from "react";
import api from "../api/axios";
import type { User } from "../types/user";


export const useUsers =()=>{

const [users,setUsers]=
useState<User[]>([]);

useEffect(()=>{

api.get("/api/users")
.then(res=>{

setUsers(res.data);

});

},[]);

return users;

};