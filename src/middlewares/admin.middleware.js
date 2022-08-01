import users from "../database";

const adminMiddleware = (req, res, next) => {
  const user = users.find((user) => user.email === req.body.email);
  
  const admin = user.isAdm;

  if (admin) {
    return next();
    
  } 

  return res.status(401).json({
    message: "Usuário não autorizado",
  });
};

export default adminMiddleware;
