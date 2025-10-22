jest.mock("../repository/userRepository");
jest.mock("../services/authenticationService");
jest.mock("bcrypt");
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })),
}));

const request = require("supertest");
const app = require("../server/index.js");

const UserRepository = require("../repository/userRepository");
const AuthenticacionService = require("../services/authenticationService");

const { generateValidToken, generateInvalidToken } = require("./helpers/testHelpers");

describe("GET /", () => {
  it("debería responder 200 y el mensaje de bienvenida", async() => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Bienvenido a PyCraft");
  });
});

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería responder 400 cuando falta el email", async() => {
    const response = await request(app)
      .post("/login")
      .send({ password: "Password123!" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email y contraseña son requeridos");
  });

  it("debería responder 400 cuando falta la contraseña", async() => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email y contraseña son requeridos");
  });

  it("debería responder 401 cuando el email no existe", async() => {
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

  it("debería responder 401 cuando la contraseña es incorrecta", async() => {
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

  it("debería responder 401 cuando el usuario no está verificado", async() => {
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
});

describe("POST /verify-email", () => {
  const validUserData = {
    name: "Test",
    lastName: "User",
    email: "newuser@example.com",
    password: "Password123!",
    code: "123456",
    originalCode: "123456",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería responder 409 cuando el email ya existe", async() => {
    UserRepository.prototype.findByEmail.mockResolvedValue({ email: validUserData.email });

    const response = await request(app)
      .post("/verify-email")
      .send(validUserData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("El usuario o email ya existe");
  });

  it("debería responder 400 cuando faltan campos requeridos", async() => {
    UserRepository.prototype.findByEmail.mockResolvedValue(null);

    const { password, ...incompleteData } = validUserData;

    const response = await request(app)
      .post("/verify-email")
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Todos los campos son requeridos para la verificación.");
  });

  it("debería responder 400 cuando el código de verificación es inválido", async() => {
    UserRepository.prototype.findByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post("/verify-email")
      .send({ ...validUserData, code: "654321" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Código de verificación inválido.");
  });
});

describe("POST /register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería generar y devolver un código de 6 dígitos", async() => {
    const response = await request(app)
      .post("/register")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Código de verificación enviado.");
    expect(response.body.verificationCode).toBeDefined();
    expect(response.body.verificationCode).toMatch(/^\d{6}$/);

    const code = parseInt(response.body.verificationCode);
    expect(code).toBeGreaterThanOrEqual(100000);
    expect(code).toBeLessThanOrEqual(999999);
  });
});

describe("POST /logingoogle", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería responder 400 cuando no se proporciona el token", async() => {
    const response = await request(app)
      .post("/logingoogle")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Inicio Invalido");
  });

  it("debería responder 401 cuando el token de Google es inválido", async() => {
    AuthenticacionService.prototype.loginGoogleS.mockResolvedValue({ token: null, user: null });

    const response = await request(app)
      .post("/logingoogle")
      .send({ token: "token-invalido" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token de Google inválido o error en la autenticación.");
  });
});

describe("GET /api/user/me (rutas protegidas)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería responder 401 cuando no se envía token", async() => {
    const response = await request(app).get("/api/user/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token provided");
  });

  it("debería responder 403 cuando se envía un token inválido", async() => {
    const invalidToken = generateInvalidToken();

    const response = await request(app)
      .get("/api/user/me")
      .set("Cookie", [`authToken=${invalidToken}`]);

    expect(response.status).toBe(403);
  });
});
