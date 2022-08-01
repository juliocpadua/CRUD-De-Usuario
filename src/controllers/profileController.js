import profileService from "../services/profileService";
import users from "../database";

const profileController = (req, res) => {
  const id = req.userId;
  const user = users.find((user) => user.id === id);
  profileService(user);
  return res.json(user);
};

export default profileController;
