const { sequelize, Wallet } = require("../models");
const AppError = require("../utils/AppError");
const { hashPassword, comparePassword } = require("../utils/password");
const { signAccessToken } = require("../utils/jwt");
const userRepo = require("../repositories/user.repo");

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

async function register({ name, email, password, role }) {
  const normalizedEmail = normalizeEmail(email);

  return sequelize.transaction(async (t) => {
    const existing = await userRepo.findByEmail(normalizedEmail, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (existing) throw new AppError(409, "Email already registered");

    const passwordHash = await hashPassword(password);

    const user = await userRepo.createUser(
      {
        name,
        email: normalizedEmail,
        passwordHash,
        role: role || "worker",
        kycStatus: "unsubmitted",
      },
      { transaction: t }
    );

    await Wallet.create({ userId: user.id }, { transaction: t });

    const token = signAccessToken(user);

    return {
      user: safeUser(user),
      token,
    };
  });
}

async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const user = await userRepo.findByEmail(normalizedEmail);
  if (!user) throw new AppError(401, "Invalid email or password");

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new AppError(401, "Invalid email or password");

  const token = signAccessToken(user);
  return { token };
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    kycStatus: user.kycStatus,
    createdAt: user.createdAt,
  };
}

module.exports = { register, login, safeUser };
