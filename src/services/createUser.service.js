import { v4 as uuidv4 } from "uuid";
import users from "../database";
import { hash } from "bcrypt";

const createUserService = async (userData) => {
  const user = userData;

  const hashedPassword = await hash(userData.password, 10);

  user.password = hashedPassword;
  user.createdOn = new Date();
  user.updatedOn = new Date();

  user.id = uuidv4();
  users.push(user);
  const newUser = users.find((user) => user.email === userData.email);

  return {
    name: newUser.name,
    email: newUser.email,
    uuid: newUser.id,
    createdOn: newUser.createdOn,
    updatedOn: newUser.updatedOn,
    isAdm: newUser.isAdm,
  };
};

export default createUserService;
