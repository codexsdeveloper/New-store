var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

var Users = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      default: null,
      maxlength: 30,
    },
    telegram: {
      type: String,
      unique: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
    },
    pin: {
      type: Number,
      maxlength: 4,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {},
  {
    timestamps: true,
  }
);

Users.methods.generateAuthToken = async function () {
  try {
    const Newtoken = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: Newtoken });
    await this.save();
    return Newtoken;
  } catch (error) {
    res.send("the Error part" + error);
  }
};

const Registers = mongoose.model("Users", Users);

module.exports = Registers;
