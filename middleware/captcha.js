const { json } = require("body-parser");
var svgCaptcha = require("svg-captcha");

module.exports.CaptchaVerify = function CaptchaVerify(data, msg) {
  const captcha = svgCaptcha.create();
  msg = captcha.text;
  console.log(msg, ">>>>>>");
};
