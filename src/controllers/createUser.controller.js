import createUserService from "../services/createUser.service";

const createUserController = async (request, response) => {
  const user = request.body;

  const newUser = await createUserService(user);

  return response.status(201).json(newUser);
};

export default createUserController;
