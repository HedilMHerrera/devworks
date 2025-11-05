jest.mock("../repository/userRepository");
jest.mock("../services/authenticationService");
jest.mock("bcrypt");

const request = require("supertest");
const app = require("../server/index.js");

const AuthenticacionService = require("../services/authenticationService");

const {
  generateValidToken,
  decodeToken,
  extractTokenFromCookie,
} = require("./helpers/testHelpers");

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "secret";
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /login", () => {
  test("debería responder 400 cuando falta el email", async() => {
    const response = await request(app)
      .post("/login")
      .send({ password: "Password123!" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email y contraseña son requeridos");
  });

  test("debería responder 400 cuando falta la contraseña", async() => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email y contraseña son requeridos");
  });

  test("debería responder 401 cuando el email no existe", async() => {
    AuthenticacionService.prototype.login.mockResolvedValue({ token: null, user: null });

    const response = await request(app)
      .post("/login")
      .send({
        email: "noexiste@example.com",
        password: "Password123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Nombre de usuario o contrasenia incorrectas");
  });

  test("debería responder 401 cuando la contraseña es incorrecta", async() => {
    AuthenticacionService.prototype.login.mockResolvedValue({ token: null, user: null });

    const response = await request(app)
      .post("/login")
      .send({
        email: "usuario@example.com",
        password: "ContraseñaIncorrecta",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Nombre de usuario o contrasenia incorrectas");
  });

  test("debería responder 401 cuando el usuario no está verificado", async() => {
    AuthenticacionService.prototype.login.mockResolvedValue({ token: null, user: null });

    const response = await request(app)
      .post("/login")
      .send({
        email: "noverificado@example.com",
        password: "Password123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Nombre de usuario o contrasenia incorrectas");
  });

  test("debería autenticar con credenciales válidas y generar JWT + cookie", async() => {
    const plainPassword = "Password123!";

    const mockedUser = {
      id: 555,
      email: "logintest@example.com",
      name: "Login",
      lastName: "User",
      role: "student",
    };

    const token = generateValidToken({ id: mockedUser.id, email: mockedUser.email });
    AuthenticacionService.prototype.login.mockResolvedValueOnce({ token, user: mockedUser });

    const response = await request(app)
      .post("/login")
      .send({
        email: "logintest@example.com",
        password: plainPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe("logintest@example.com");
    expect(response.body.user.password).toBeUndefined();

    const decoded = decodeToken(response.body.token);
    expect(decoded.id).toBe(mockedUser.id);
    expect(decoded.email).toBe("logintest@example.com");

    expect(response.headers["set-cookie"]).toBeDefined();
    const cookieToken = extractTokenFromCookie(response);
    expect(cookieToken).toBe(response.body.token);
  });
});

describe("POST /logingoogle", () => {
  test("debería responder 400 cuando no se proporciona el token", async() => {
    const response = await request(app)
      .post("/logingoogle")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Inicio Invalido");
  });

  test("debería responder 401 cuando el token de Google es inválido", async() => {
    AuthenticacionService.prototype.loginGoogleS.mockResolvedValue({ token: null, user: null });

    const response = await request(app)
      .post("/logingoogle")
      .send({ token: "token-invalido" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token de Google inválido o error en la autenticación.");
  });
});
