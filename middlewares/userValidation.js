const Joi = require('joi');
const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(3).max(15),
  city: Joi.string().required(),
  fullname:Joi.string().required().max(15)
});

async function registerValidation(req, res, next) {
  try {
    const {
      city,password,username,fullname
    } = req.body;
    await registerSchema.validateAsync(
      {
        city,username,fullname,password
      }
    );
    next();
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}
module.exports = registerValidation;
