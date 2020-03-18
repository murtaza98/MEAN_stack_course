const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // header sample --->
  // Bearer jwt_token_will_be_here
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'some_server_secret'); // verify will throw an expection if token is not valid
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'authentication token not found in header or token not valid'
    })
  }

};
