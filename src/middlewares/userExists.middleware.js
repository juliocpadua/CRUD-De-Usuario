import users from "../database";

const userExists = (req, res, next) => {
  const { email } = req.body;

  const user = users.find((user) => user.email === email);

  if (user) {
    return res.status(400).json({
      message: "Email já cadastrado",
    });
  }

  next();
};

export default userExists;
