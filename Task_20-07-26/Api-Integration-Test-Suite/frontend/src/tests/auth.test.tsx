import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  BrowserRouter,
} from "react-router-dom";

import Login from "../pages/Login";

import {
  AuthProvider,
} from "../context/AuthContext";

import { authService } from "../services/auth.service";


// Mock Auth Service

vi.mock(
  "../services/auth.service",
  () => ({
    authService: {
      login: vi.fn(),
    },
  })
);



describe(
  "Login Integration Test",
  () => {


    it(
      "renders login page",
      () => {

        render(
          <BrowserRouter>
            <AuthProvider>
              <Login />
            </AuthProvider>
          </BrowserRouter>
        );


        expect(
          screen.getByText("Login")
        ).toBeInTheDocument();

      }
    );



    it(
      "allows user login with valid credentials",
      async () => {


        (
          authService.login as any
        ).mockResolvedValue({

          token:
            "dummy-token",

          user:{
            id:1,
            name:"John",
            email:"john@test.com"
          }

        });



        render(
          <BrowserRouter>
            <AuthProvider>
              <Login />
            </AuthProvider>
          </BrowserRouter>
        );



        fireEvent.change(
          screen.getByPlaceholderText(
            "Email"
          ),
          {
            target:{
              value:
              "john@test.com"
            }
          }
        );



        fireEvent.change(
          screen.getByPlaceholderText(
            "Password"
          ),
          {
            target:{
              value:
              "123456"
            }
          }
        );



        fireEvent.click(
          screen.getByText(
            "Login"
          )
        );



        await waitFor(
          () => {

            expect(
              authService.login
            ).toHaveBeenCalledWith({

              email:
              "john@test.com",

              password:
              "123456"

            });

          }
        );


      }
    );



    it(
      "shows error for invalid login",
      async()=>{


        (
          authService.login as any
        ).mockRejectedValue({

          response:{
            data:{
              message:
              "Invalid Credentials"
            }
          }

        });



        render(
          <BrowserRouter>
            <AuthProvider>
              <Login />
            </AuthProvider>
          </BrowserRouter>
        );



        fireEvent.click(
          screen.getByText(
            "Login"
          )
        );



        await waitFor(()=>{

          expect(
            screen.getByText(
              "Invalid Credentials"
            )
          )
          .toBeInTheDocument();

        });


      }
    );


  }
);