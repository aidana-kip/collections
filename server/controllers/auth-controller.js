const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  if (req.headers["access-token"]) {
    const token = req.headers["access-token"];

    try {
      const decoded = jwt.verify(token, "testKey");
      req.user = { userId: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      console.log('Unable to parse JWT token: ' + token);
      res.status(401).send();;
    }
  } else {
    next();
  }
};

module.exports = { authenticateUser };
