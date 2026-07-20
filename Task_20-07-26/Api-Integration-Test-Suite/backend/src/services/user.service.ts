import { prisma } from "../config/prisma.js";


// Get all users

export const getAllUsers = async () => {

  const users = await prisma.user.findMany({

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }

  });


  return users;

};



// Get user by ID

export const getUserById = async (
  id: number
) => {

  const user = await prisma.user.findUnique({

    where: {
      id
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }

  });


  return user;

};



// Create User

export const createUser = async (
  data: {
    name: string;
    email: string;
    password: string;
  }
) => {


  const user = await prisma.user.create({

    data

  });


  return user;

};



// Update User

export const updateUser = async (
  id: number,
  data: {
    name?: string;
    email?: string;
  }
) => {


  const user = await prisma.user.update({

    where: {
      id
    },

    data

  });


  return user;

};



// Delete User

export const deleteUser = async (
  id: number
) => {


  const user = await prisma.user.delete({

    where: {
      id
    }

  });


  return user;

};