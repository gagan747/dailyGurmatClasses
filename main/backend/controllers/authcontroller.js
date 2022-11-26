const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');


async function userlogin(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'ਉਪਭੋਗਤਾ ਨਹੀਂ ਮਿਲਿਆ' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(
        { _id: user._id, },
        'efreegefreegregfvftrbggggggggggggg',
      );
      res.header('x-auth-token', token);
      return res.status(200).json({ message: 'ਸਾਈਨ-ਇਨ ਸਫਲ',username });
    }
    res.status(401).json({ message: 'ਗਲਤ ਪਾਸਵਰਡ' });
  } catch (err) {
    return res.status(401).json({ message: ` ${err}` });
  }
}

async function registerdata(req, res, next) {
  try {
    const {
      username, password, fullname, city } = req.body;
    const user = new Users({
      username, password, fullname, city });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    const token = jwt.sign(
      { _id: user._id },
      'efreegefreegregfvftrbggggggggggggg',
    );
    res.header('x-auth-token', token);
    res.status(201).json({
      message: "ਸਾਈਨ ਅੱਪ ਕਰਨ ਲਈ ਧੰਨਵਾਦ",username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'ਉਪਭੋਗਤਾ ਦਾ ਨਾਮ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ' });
    }
    res.status(400).json({ message: `${err}` });
  }
}
module.exports.register = registerdata;
module.exports.login = userlogin;
