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

const findRefreshToken = async (token) => {
  return await prisma.refreshToken.findUnique({
    where: {
      token,
    },
  });
};

const deleteRefreshToken = async (token) => {
  return await prisma.refreshToken.delete({
    where: {
      token,
    },
  });
};

export {
  findUserByEmail,
  findUserById,
  createUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};