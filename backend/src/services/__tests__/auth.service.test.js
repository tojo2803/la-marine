jest.mock("../../repositories/admin.repository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const adminRepository = require("../../repositories/admin.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../auth.service");

describe("authService.login", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  test("rejette si email ou mot de passe manquant (400)", async () => {
    await expect(authService.login("", "")).rejects.toMatchObject({ statusCode: 400 });
    await expect(authService.login("a@b.fr", "")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("rejette si l'admin n'existe pas (401, message générique)", async () => {
    adminRepository.findByEmailWithPassword.mockResolvedValue(null);

    await expect(authService.login("inconnu@lamarine.fr", "motdepasse")).rejects.toMatchObject({
      statusCode: 401,
      message: "Identifiants invalides.",
    });
  });

  test("rejette si le mot de passe ne correspond pas (401)", async () => {
    adminRepository.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      email: "admin@lamarine.fr",
      passwordHash: "hash-en-base",
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.login("admin@lamarine.fr", "mauvais-mdp")).rejects.toMatchObject({
      statusCode: 401,
      message: "Identifiants invalides.",
    });
  });

  test("renvoie un token quand les identifiants sont corrects", async () => {
    adminRepository.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      email: "admin@lamarine.fr",
      fullName: "Admin Test",
      passwordHash: "hash-en-base",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("un-faux-token-jwt");

    const result = await authService.login("admin@lamarine.fr", "bon-mdp");

    expect(result.token).toBe("un-faux-token-jwt");
    expect(result.admin).toEqual({ id: 1, email: "admin@lamarine.fr", fullName: "Admin Test" });
    // On vérifie qu'on ne renvoie jamais le hash du mot de passe au client.
    expect(result.admin.passwordHash).toBeUndefined();
  });
});
