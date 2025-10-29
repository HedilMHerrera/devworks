const request = require("supertest");
const app = require("../server/index");

describe("POST /login", ()=>{
  it("debe emitir un token JWT y guardarlo en una cookie", async() => {
    const res = await request(app)
      .post("/login")
      .send({ email: "mejiasanchezluis123@gmail.com", password: "Mejia1234#" })
      .expect(200);

    expect(res.headers["set-cookie"]).toBeDefined();

    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toContain("authToken=");
  });
});

