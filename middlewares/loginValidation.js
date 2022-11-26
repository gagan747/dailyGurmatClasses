const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
async function loginValidation(req, res, next) {
  try {
    const { username } = req.body;
    const { password } = req.body;
    await loginSchema.validateAsync({ username, password });
    next();
  } catch (err) {
    logger.error(err);
    return res.status(401).json({ message: `${err}` });
  }
}
module.exports = loginValidation;
