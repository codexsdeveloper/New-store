//User Login Controller
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt");
router.use(bodyParser.json());
var fs = require("fs");
var session = require("express-session");
var flash = require("connect-flash");
const path = require("path");
const Validator = require("validator");
const { log } = require("console");
var svgCaptcha = require("svg-captcha");
const RegistersModel = require("../models/users");

const Signup_Get = async (req, res, next) => {
  try {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    return res.json({ message: "Hello Registers..!", captcha: captcha });
  } catch (error) {
    console.log(error);
  }
};

const Signup_Post = async (req, res, next) => {
  try {
    const { username, telegram, password, pin, captcha } = req.body;
    var len = Number(pin);
    console.log(len);
    //if all field empty then return error
    if (!username && !telegram && !password && !pin && !captcha)
      return res.json({ error: "All field Required..!", status: false });

    //if captcha does not match client captcha then return error
    if (captcha !== req.session.captcha) {
      return res.json({
        error: "Enter Valid Captcha..!",
        status: false,
      });
    }

    if (username.length < 5 || username.length > 30 ||!Validator.matches(username, "^[a-zA-Z0-9_.-]*$"))
      return res.json({ error: "Username Invalid..!", status: false });
    const OldUser = await RegistersModel.findOne({ username: username });
    console.log(OldUser, ">>>>");

    if (telegram.length < 5 || telegram.length > 30)
    return res.json({ error: "Telegram Invalid..!", status: false });
    if (OldUser)
      return res.json({ error: "User Already Exist..!", status: false });

    const OldTelegram = await RegistersModel.findOne({ telegram: telegram });
    console.log(OldTelegram, ">>>>>", telegram);
    if (OldTelegram)
      return res.json({ error: "Telegram Already Exist..!", status: false });

    if (!(pin.length == 4) || isNaN(len))
      return res.json({
        error: "Pin Must Be 4 Digit Number..!",
        status: false,
      });

    if (Validator.isStrongPassword(password) != true)
      return res.json({
        error:
          "Password Must Be Strong (minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1)..!",
        status: false,
      });
      const BcryptPass = await bcrypt.hash(password, 10);
    const NewUser = new RegistersModel({
      username: username,
      telegram: telegram,
      password: BcryptPass,
      pin: len,
      admin: false,
    });
    await NewUser.save();
    const captchaGen = svgCaptcha.create();
    req.session.captcha = captchaGen.text;
    return res.json({ message: "New Users Added..!", status: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  Signup_Get,
  Signup_Post,
};
