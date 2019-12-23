const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    //console.log(decoded.role);
    if (!decoded.ID) {
      res.json({
        status: 403,
        message: "Token is invalid.No user is accoicated with this token",
        data: []
      });

    }
    req.user = decoded;
    //console.log(req.user);

    next();
  }
  catch (ex) {

    res.json({
      status: 400,
      message: "Invalid token.",
      data: []
    });
    //res.status(400).send('Invalid token.');
  }
}