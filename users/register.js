//Users Login Router

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const RegistersRoute = require('../controller/register');

router.get('/', RegistersRoute.Signup_Get);
router.post('/', RegistersRoute.Signup_Post)

module.exports = router