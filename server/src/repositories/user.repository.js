import prisma from '../config/prisma.js';

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export {
  findUserByEmail,
  createUser,
};