jest.mock("../repository/userRepository");
jest.mock("bcrypt");
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })),
}));

const request = require("supertest");
const app = require("../server/index.js");
const bcrypt = require("bcrypt");
const UserRepository = require("../repository/userRepository");

const {
  decodeToken,
  extractTokenFromCookie,
} = require("./helpers/testHelpers");

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "secret";
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /register", () => {
  test("debería generar y devolver un código de 6 dígitos", async() => {
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

describe("POST /verify-email", () => {
  test("debería crear usuario, hashear contraseña, asignar rol student y generar JWT", async() => {
    const userData = {
      name: "Integration",
      lastName: "Test",
      email: "integration@example.com",
      password: "Password123!",
      code: "123456",
      originalCode: "123456",
    };

    UserRepository.prototype.findByEmail.mockResolvedValueOnce(null);
    bcrypt.hash.mockResolvedValueOnce("hashedPassword");

    const createdUser = {
      id: 101,
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: "hashedPassword",
      role: { id: 1, name: "student" },
      isVerified: true,
    };
    UserRepository.prototype.createUser.mockResolvedValueOnce(createdUser);

    UserRepository.prototype.login.mockResolvedValueOnce({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      lastName: createdUser.lastName,
      role: "student",
    });

    const response = await request(app)
      .post("/verify-email")
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email verificado exitosamente.");
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();

    const decoded = decodeToken(response.body.token);
    expect(decoded.email).toBe(userData.email);

    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(UserRepository.prototype.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        password: "hashedPassword",
        isVerified: true,
      }),
    );

    expect(response.headers["set-cookie"]).toBeDefined();
    const cookieToken = extractTokenFromCookie(response);
    expect(cookieToken).toBe(response.body.token);
  });
});

describe("GET /check-verification-status", () => {
  test("debería devolver estado de verificación para emails verificado y no verificado", async() => {
    UserRepository.prototype.findByEmail
      .mockResolvedValueOnce({ email: "verified@example.com", isVerified: true })
      .mockResolvedValueOnce({ email: "unverified@example.com", isVerified: false });

    const response1 = await request(app)
      .get("/check-verification-status")
      .query({ email: "verified@example.com" });

    expect(response1.status).toBe(200);
    expect(response1.body.isVerified).toBe(true);

    const response2 = await request(app)
      .get("/check-verification-status")
      .query({ email: "unverified@example.com" });

    expect(response2.status).toBe(200);
    expect(response2.body.isVerified).toBe(false);
  });
});
