import request from "supertest";
import app from "../app";

const userAdm = {
  name: "daniel",
  email: "daniel@kenzie.com",
  password: "123456",
  isAdm: true,
};

const loginAdm = {
  email: "daniel@kenzie.com",
  password: "123456",
};

const userNotAdm = {
  name: "ugo",
  email: "ugo@kenzie.com",
  password: "123456",
  isAdm: false,
};

const loginNotAdm = {
  email: "ugo@kenzie.com",
  password: "123456",
};

describe("Testes rota POST /users", () => {
  it("Testando criação de usuário com um corpo correto", async () => {
    const response = await request(app).post("/users").send(userAdm);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("createdOn");
    expect(response.body).toHaveProperty("updatedOn");
    expect(response.body).toHaveProperty("uuid");
    expect(response.body).toHaveProperty("isAdm");
    expect(response.body).not.toHaveProperty("password");
  });

  it("Testando criação de usuário com e-mail já utilizado", async () => {
    const response = await request(app).post("/users").send(userAdm);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("Testando rota POST /login", () => {
  it("Testando login válido", async () => {
    const response = await request(app).post("/login").send(loginAdm);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  it("Testando login inválido", async () => {
    loginAdm.password = "123";
    const response = await request(app).post("/login").send(loginAdm);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    loginAdm.password = "123456";
  });
});

describe("Testando rota GET /users", () => {
  it("Testando listagem de usuários", async () => {
    const login = await request(app).post("/login").send(loginAdm);
    const { token } = login.body;

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Testando listagem de usuários sem token", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Testando listagem de usuários sem autorização", async () => {
    await request(app).post("/users").send(userNotAdm);
    const login = await request(app).post("/login").send(loginNotAdm);
    const { token } = login.body;
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

describe("Testando rota GET /users/profile", () => {
  it("Testando listagem do perfil de usuário", async () => {
    const login = await request(app).post("/login").send(loginNotAdm);
    const { token } = login.body;
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("uuid");
    expect(response.body).toHaveProperty("createdOn");
    expect(response.body).toHaveProperty("updatedOn");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("isAdm");
    expect(response.body).not.toHaveProperty("password");
  });

  it("Testando listagem do perfil de usuário", async () => {
    const response = await request(app).get("/users/profile");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

const updateNotAdm = {
  name: "Ugo Roveda",
  email: "ugo@kenzie.com",
};

const updateAdm = {
  name: "Daniel Kenzie",
  email: "daniel@kenzie.com",
};

describe("Testando rota PATCH /users/<uuid>", () => {
  it("Testando atualização sem token", async () => {
    const login = await request(app).post("/login").send(loginNotAdm);
    const { token } = login.body;
    const user = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .patch(`/users/${user.body.uuid}`)
      .send(updateNotAdm);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Testando atualização do próprio usuário sem permissão de ADM", async () => {
    const login = await request(app).post("/login").send(loginNotAdm);
    const { token } = login.body;
    const user = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .patch(`/users/${user.body.uuid}`)
      .send(updateNotAdm)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("uuid");
    expect(response.body).toHaveProperty("createdOn");
    expect(response.body).toHaveProperty("updatedOn");
    expect(response.body).toHaveProperty("name", updateNotAdm.name);
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("isAdm", user.body.isAdm);
    expect(response.body).not.toHaveProperty("password");
  });

  it("Testando atualização de outro usuário sem permissão de ADM", async () => {
    const signinNotAdm = await request(app).post("/login").send(loginNotAdm);
    const signinAdm = await request(app).post("/login").send(loginAdm);
    const tokenNotAdm = signinNotAdm.body.token;
    const tokenAdm = signinAdm.body.token;

    const adm = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${tokenAdm}`);

    const response = await request(app)
      .patch(`/users/${adm.body.uuid}`)
      .send(updateAdm)
      .set("Authorization", `Bearer ${tokenNotAdm}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Testando atualização de qualquer usuário com permissão de ADM", async () => {
    const signinNotAdm = await request(app).post("/login").send(loginNotAdm);
    const signinAdm = await request(app).post("/login").send(loginAdm);
    const tokenNotAdm = signinNotAdm.body.token;
    const tokenAdm = signinAdm.body.token;

    const notAdm = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${tokenNotAdm}`);

    const response = await request(app)
      .patch(`/users/${notAdm.body.uuid}`)
      .send({ name: "Ugo Kenzie" })
      .set("Authorization", `Bearer ${tokenAdm}`);

    expect(response.body).toHaveProperty("name", "Ugo Kenzie");
  });
});

describe("Testando rota DELETE /users/<uuid>", () => {
  it("Testando deleção sem token", async () => {
    const login = await request(app).post("/login").send(loginAdm);
    const { token } = login.body;
    const user = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app).delete(`/users/${user.body.uuid}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Testando deleção de outro usuário sem permissão de ADM", async () => {
    const signinNotAdm = await request(app).post("/login").send(loginNotAdm);
    const signinAdm = await request(app).post("/login").send(loginAdm);
    const tokenNotAdm = signinNotAdm.body.token;
    const tokenAdm = signinAdm.body.token;

    const adm = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${tokenAdm}`);

    const response = await request(app)
      .delete(`/users/${adm.body.uuid}`)
      .set("Authorization", `Bearer ${tokenNotAdm}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Testando deleção de outro usuário com permissão de ADM", async () => {
    const signinNotAdm = await request(app).post("/login").send(loginNotAdm);
    const signinAdm = await request(app).post("/login").send(loginAdm);
    const tokenNotAdm = signinNotAdm.body.token;
    const tokenAdm = signinAdm.body.token;

    const notAdm = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${tokenNotAdm}`);

    const response = await request(app)
      .delete(`/users/${notAdm.body.uuid}`)
      .set("Authorization", `Bearer ${tokenAdm}`);

    expect(response.body).toHaveProperty("message");
  });

  it("Testando deleção do próprio usuário", async () => {
    const login = await request(app).post("/login").send(loginAdm);
    const { token } = login.body;
    const user = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .delete(`/users/${user.body.uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("message");
  });
});
