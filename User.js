const mongoose = require("mongoose");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    password: {
      type: String,
      required: true
    }
  },
  // make sure name collection name isn't pluralized
  { collection: "user" }
);

UserSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      email: this.email,
      _id: this._id
    },
    // you can just make this something like "shhh" (don't use that for production)
    process.env.JWT_SECRET,
    {
      expiresIn: "10 minutes",
      header: {
        typ: "jwt"
      }
    }
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  };
};

module.exports = mongoose.model("User", UserSchema);
