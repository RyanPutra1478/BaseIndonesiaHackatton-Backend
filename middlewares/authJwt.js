const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwt");
const userRepo = require("../repositories/user.repo");

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token)
      throw new AppError(401, "Missing or invalid Authorization header");

    const payload = verifyAccessToken(token);

    const userId = Number(payload.sub);
    const user = await userRepo.findById(userId);

    if (!user) throw new AppError(401, "User not found");

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    next(err);
  }
};
