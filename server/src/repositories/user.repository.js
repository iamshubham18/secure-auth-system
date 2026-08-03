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

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const createRefreshToken = async (tokenData) => {
  return await prisma.refreshToken.create({
    data: tokenData,
  });
};

export {
  findUserByEmail,
  findUserById,
  createUser,
  createRefreshToken,
};