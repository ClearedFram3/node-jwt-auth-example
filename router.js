const router = require("express").Router();
const argon2 = require("argon2");
const User = require("./User");
const jwt = require("express-jwt");

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  // use express-validator here instead
  if (!email) {
    return res.status(422).json({
      errors: "email is required"
    });
  }
  if (!password) {
    return res.status(422).json({
      errors: "password is required"
    });
  }

  const hash = await argon2.hash(password);
  const user = await User.create({ email, password: hash });
  // FIXME: needs to send JWT for headers
  return res.json({ user: user.toAuthJSON() });
  // return res.json({ user: user._id })
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(422).json({
      errors: "email is required"
    });
  }
  if (!password) {
    return res.status(422).json({
      errors: "password is required"
    });
  }

  const user = await User.findOne({ email });
  if (argon2.verify(user.password, password)) {
    return res.status(200).json({ data: user.toAuthJSON() });
  } else {
    return res.json({ error: "incorrect password" });
  }
});

router.post(
  "/protected",
  // you can just make this something like "shhh" (don't use that for production
  jwt({ secret: process.env.JWT_SECRET }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401); //json({ msg: "failed auth" })
    }
    const user = await User.findOne({ _id: req.user.id });
    return res.status(200).send({
      reqUserDataAkaToken: req.user,
      msg: "success"
    });
  }
);

module.exports = router;
