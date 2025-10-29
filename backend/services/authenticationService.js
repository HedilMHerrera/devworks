const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

class AuthenticacionService {
  constructor(repository) {
    this._repository = repository;
    this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async login(email, pass, isVerifiedLogin = false) {
    const user = await this._repository.login(email, pass, isVerifiedLogin);
    let token = null;
    if (user) {
      token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    }
    return { token, user };
  }

  async loginGoogleS(tokenUser) {
    try {
      const ticket = await this._googleClient.verifyIdToken({
        idToken: tokenUser,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, given_name, family_name, sub: googleId } = payload;

      let user = await this._repository.findByEmail(email);

      if (!user) {
        // eslint-disable-next-line no-console
        console.log(`Usuario con email ${email} no encontrado. Creando nuevo usuario...`);
        user = await this._repository.createUser({
          name: given_name || "Usuario",
          lastName: family_name || "Google",
          email: email,
          password: null,
          googleId: googleId,
          phone: null,
          isVerified: true,
        });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      const roleName = user.role.name;
      const { password: _, role: __, roleId: ___, ...safeUser } = user;
      const finalUser = { role: roleName, ...safeUser };
      return { token, user: finalUser };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error en la autenticación con Google:", error);
      return { token: null, user: null };
    }
  }
}

module.exports = AuthenticacionService;
