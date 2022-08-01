import listUsersService from "../services/listUsers.service";

const listUserController = (request, response) => {
  const users = listUsersService();

  return response.status(200).json(users);
};

export default listUserController;
