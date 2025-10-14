import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(`http://localhost:7000/api`);

describe("TESTING: Rutas de Auth", () => {
  const admin = {
    email: `m.e.altamirano88@gmail.com`,
    password: "hola",
    name: "Mauro",
  };
  let cookies;
  let userId;
  it("POST /api/auth/register error 401 al registrar un usuario existente", async () => {
    const response = await requester.post("/auth/register").send(admin);
    // console.log(response);
    const { status, _body } = response;
    expect(_body.error).to.be.equals("Invalid credentials");
    expect(status).to.be.equal(401);
  });
  it("POST /api/auth/register crea un usuario no registrado", async () => {
    const email = `test${Date.now()}@mail.com`;
    const data = {
      email,
      password: "test1234",
      name: "Testing",
    };
    const response = await requester.post("/auth/register").send(data);
    const { status, _body } = response;
    userId = _body.response._id;
    expect(status).to.be.equal(201);
  });
  it("POST /api/auth/login loguea un usuario ya registrado", async () => {
    const response = await requester.post("/auth/login").send(admin);
    const { status, headers } = response;
    cookies = headers["set-cookie"];
    expect(status).to.be.equals(200);
  });
  it("POST /api/auth/login verifica el mensaje del usuario loguead", async () => {
    const response = await requester.post("/auth/login").send(admin);
    const { _body } = response;
    expect(_body.response).to.be.equals("Logged in");
  });
  it("POST /api/auth/online verificar estado online", async () => {
    const response = await requester
      .post("/auth/online")
      .set("Cookie", cookies);
    const { status } = response;
    expect(status).to.be.equals(200);
  });
  it("POST /api/auth/online para verificar mensaje online ", async () => {
    const response = await requester
      .post("/auth/online")
      .set("Cookie", cookies);
    const { _body } = response;
    expect(_body.response).to.be.equals("It's online");
  });
  it("PUT /api/users/:uid actualizar el rol del usuario", async () => {
    const response = await requester
      .put(`/users/${userId}`)
      .send({ role: "ADMIN" })
      .set("Cookie", cookies);
    const { status, _body } = response;
    expect(_body.response.role).to.equal("ADMIN");
    expect(status).to.be.equals(200);
  });
  it("PUT /api/users/:uid actualizar el nombre  del usuario", async () => {
    const response = await requester
      .put(`/users/${userId}`)
      .send({ name: "Name Update Testing" })
      .set("Cookie", cookies);
    const { status, _body } = response;
    expect(_body.response.name).to.equal("Name Update Testing");
    expect(status).to.be.equals(200);
  });
  it("DELETE /api/users/:uid tiene exito el destroy del user creado", async () => {
    const response = await requester
      .delete(`/users/${userId}`)
      .set("Cookie", cookies);
    const { status } = response;
    expect(status).to.be.equals(200);
  });
  it("POST /api/auth/signout cerrar sesión correctamente", async () => {
    const response = await requester
      .post("/auth/signout")
      .set("Cookie", cookies);
    const { status } = response;
    expect(status).to.be.equals(200);
  });
});
