var jwt = require("jsonwebtoken");
const JWT_SECRET = "BhumitWillBecameAProfitableTrader";

const fetchuser = (req, res, next) => {
  //Get user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Invalid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    //next will call next function video 51
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = fetchuser;
