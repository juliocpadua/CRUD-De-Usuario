import users from "../database";

const deleteUserService = (id)=>{
    const userIndex = users.findIndex((element) => element.id === id);

    if (userIndex === -1) {
      return "User not found";
    }
  
    users.splice(userIndex, 1);
  
    return "Usuário excluido";
}

export default deleteUserService;