const jwt = require('jsonwebtoken');
const User = require('../models/users');

async function Authenticate(req, res, next) {
  try {
    if (req.headers.token === undefined) {
      res.status(307).json({ message: 'not logged in' });
      return;
    }
    const { token } = req.headers;
    const verifytoken = jwt.verify(token, 'efreegefreegregfvftrbggggggggggggg');
    const rootuser = await User.findOne({ _id: verifytoken._id });
    if (!rootuser) { throw new Error('not logged in'); }
    req.user = rootuser;
    req.user_id = rootuser._id;
    next();
  } catch (err) {
    res.status(307).json({ message: '' + err });
  }
}
module.exports = Authenticate;
