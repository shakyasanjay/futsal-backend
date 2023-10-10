const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token not found" });
  }

  try {
    const decodedToken = jwt.verify(token, "secret-key");
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUser;
