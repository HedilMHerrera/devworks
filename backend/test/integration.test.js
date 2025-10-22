// ============================================================================
// TESTS DE INTEGRACIÓN SIN MOCKS - 5 pruebas
// Estos tests usan BD real, bcrypt real, JWT real
// ============================================================================

const request = require("supertest");
const app = require("../server/index.js");
const bcrypt = require("bcrypt");

const {
  setupIntegrationTests,
  cleanupAfterEachTest,
  teardownIntegrationTests,
  createTestUser,
  findUserByEmail,
} = require("./setup/integrationSetup");

const {
  generateValidToken,
  decodeToken,
  extractTokenFromCookie,
} = require("./helpers/testHelpers");

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

beforeAll(async() => {
  await setupIntegrationTests();
}, 30000);

afterEach(async() => {
  await cleanupAfterEachTest();
});

afterAll(async() => {
  await teardownIntegrationTests();
});

describe("POST /verify-email", () => {
  it("debería crear usuario, hashear contraseña, asignar rol student y generar JWT", async() => {
    const userData = {
      name: "Integration",
      lastName: "Test",
      email: "integration@example.com",
      password: "Password123!",
      code: "123456",
      originalCode: "123456",
    };

    const response = await request(app)
      .post("/verify-email")
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email verificado exitosamente.");
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();

    const decoded = decodeToken(response.body.token);
    expect(decoded.email).toBe(userData.email);

    const userInDB = await findUserByEmail(userData.email);
    expect(userInDB).toBeDefined();
    expect(userInDB.name).toBe(userData.name);
    expect(userInDB.lastName).toBe(userData.lastName);
    expect(userInDB.isVerified).toBe(true);

    expect(userInDB.password).not.toBe(userData.password);
    const isValidPassword = await bcrypt.compare(userData.password, userInDB.password);
    expect(isValidPassword).toBe(true);

    expect(userInDB.role.name).toBe("student");

    expect(response.headers["set-cookie"]).toBeDefined();
    const cookieToken = extractTokenFromCookie(response);
    expect(cookieToken).toBe(response.body.token);
  });
});

describe("POST /login", () => {
  it("debería autenticar con credenciales válidas y generar JWT + cookie", async() => {
    const plainPassword = "Password123!";
    const user = await createTestUser({
      email: "logintest@example.com",
      password: plainPassword,
      isVerified: true,
    });

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
    expect(decoded.id).toBe(user.id);
    expect(decoded.email).toBe("logintest@example.com");

    expect(response.headers["set-cookie"]).toBeDefined();
    const cookieToken = extractTokenFromCookie(response);
    expect(cookieToken).toBe(response.body.token);
  });
});

describe("GET /api/user/me", () => {
  it("debería retornar datos del usuario autenticado con token válido", async() => {
    const user = await createTestUser({
      name: "Protected",
      lastName: "Route",
      email: "protected@example.com",
      isVerified: true,
    });

    const token = generateValidToken({ id: user.id, email: user.email });

    const response = await request(app)
      .get("/api/user/me")
      .set("Cookie", [`authToken=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user.id);
    expect(response.body.name).toBe("Protected");
    expect(response.body.lastName).toBe("Route");
    expect(response.body.email).toBe("protected@example.com");
    expect(response.body.role).toBeDefined();
    expect(response.body.password).toBeUndefined();
  });
});

describe("GET /api/user/:id", () => {
  it("debería retornar datos del usuario solicitado desde BD real", async() => {
    const user1 = await createTestUser({
      name: "User",
      lastName: "One",
      email: "user1@example.com",
    });

    const user2 = await createTestUser({
      name: "User",
      lastName: "Two",
      email: "user2@example.com",
    });

    const token = generateValidToken({ id: user1.id, email: user1.email });

    const response = await request(app)
      .get(`/api/user/${user2.id}`)
      .set("Cookie", [`authToken=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user2.id);
    expect(response.body.name).toBe("User");
    expect(response.body.lastName).toBe("Two");
    expect(response.body.email).toBe("user2@example.com");
    expect(response.body.role).toBeDefined();
  });
});

describe("GET /check-verification-status", () => {
  it("debería devolver estado de verificación para emails verificado y no verificado", async() => {
    await createTestUser({
      email: "verified@example.com",
      isVerified: true,
    });

    await createTestUser({
      email: "unverified@example.com",
      isVerified: false,
    });

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
