const express = require('express');

const router = express.Router();
const userValidation = require('../middlewares/userValidation.js');
const loginValidation = require('../middlewares/loginValidation.js');
const authcontroller = require('../controllers/authcontroller');

const { login, register } = authcontroller;

router.post('/login', loginValidation, login);
router.post('/register', userValidation, register);

module.exports = router;
