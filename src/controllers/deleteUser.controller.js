import deleteUserService from "../services/deleteUser.service";

const deleteUserController = (req, res) => {
  const { uuid } = req.params;

  const deletedUser = deleteUserService(uuid);

  return res.json({ message: deletedUser });
};

export default deleteUserController;
