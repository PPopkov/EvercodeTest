const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Токен отсутствует" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }
  next();
};

module.exports = authMiddleware;