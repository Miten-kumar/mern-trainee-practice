import {
  describe,
  it,
  expect,
  vi,
} from "vitest";


import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";


import Users from "../pages/Users";


import {
  BrowserRouter,
} from "react-router-dom";


import {
  AuthProvider,
} from "../context/AuthContext";


import {
  userService,
} from "../services/user.service";



// Mock User Service

vi.mock(
  "../services/user.service",
  ()=>({

    userService:{

      getUsers:vi.fn(),

      createUser:vi.fn(),

      updateUser:vi.fn(),

      deleteUser:vi.fn()

    }

  })
);



describe(
  "User CRUD Integration Test",
()=>{


it(
"loads users from API",
async()=>{


(
userService.getUsers as any
)
.mockResolvedValue([

{
 id:1,
 name:"John",
 email:"john@test.com"
}

]);



render(

<BrowserRouter>

<AuthProvider>

<Users/>

</AuthProvider>

</BrowserRouter>

);



await waitFor(()=>{


expect(

screen.getByText(
"john@test.com"
)

)
.toBeInTheDocument();


});


});




it(
"creates new user",
async()=>{


(
userService.getUsers as any
)
.mockResolvedValue([]);



(
userService.createUser as any
)
.mockResolvedValue({

id:1,

name:"Test",

email:"test@test.com"

});



render(

<BrowserRouter>

<AuthProvider>

<Users/>

</AuthProvider>

</BrowserRouter>

);



fireEvent.change(

screen.getByPlaceholderText(
"Name"
),

{

target:{
value:"Test"
}

}

);



fireEvent.change(

screen.getByPlaceholderText(
"Email"
),

{

target:{
value:"test@test.com"
}

}

);



fireEvent.click(

screen.getByText(
"Create"
)

);



await waitFor(()=>{


expect(
userService.createUser
)
.toHaveBeenCalled();


});


});




it(
"deletes user",
async()=>{


(
userService.getUsers as any
)
.mockResolvedValue([

{
id:1,
name:"John",
email:"john@test.com"
}

]);



(
userService.deleteUser as any
)
.mockResolvedValue({});


render(

<BrowserRouter>

<AuthProvider>

<Users/>

</AuthProvider>

</BrowserRouter>

);



await waitFor(()=>{


fireEvent.click(

screen.getByText(
"Delete"
)

);


});



expect(
userService.deleteUser
)
.toHaveBeenCalledWith(1);



});


});