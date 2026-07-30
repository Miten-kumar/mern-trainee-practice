import type { User } from "../types/user.types";
import "../style/users.css";


interface Props {

    users: User[];

    onEdit:(user:User)=>void;

    onView:(user:User)=>void;

    onDelete:(id:number)=>void;

}



const UserTable = ({

    users,

    onEdit,

    onView,

    onDelete

}:Props)=>{


return (

<div className="table-container">


<h2 className="table-title">
Users
</h2>



<table className="user-table">


<thead>


<tr>

<th>ID</th>

<th>Name</th>

<th>Email</th>

<th>Actions</th>

</tr>


</thead>



<tbody>


{

users.map(

(user)=>(


<tr

key={user.id}

>


<td>
{user.id}
</td>


<td>
{user.name}
</td>


<td>
{user.email}
</td>



<td className="action-cell">


<button

className="btn btn-view"

onClick={()=>onView(user)}

>

View

</button>



<button

className="btn btn-edit"

onClick={()=>onEdit(user)}

>

Edit

</button>



<button

className="btn btn-delete"

onClick={()=>onDelete(user.id)}

>

Delete

</button>



</td>


</tr>


)

)

}



</tbody>


</table>


</div>

);


};


export default UserTable;