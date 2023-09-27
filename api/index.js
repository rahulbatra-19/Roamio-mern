const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
const app = express();

const bcrpytSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrpytSalt),
    });
    res.json(user);
  } catch (error) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // jwt.sign(
      //   { email: userDoc.email, id: userDoc._id },
      //   jwtSecret,
      //   {},
      //   (err, token) => {
      //     if (err) throw err;
      //     res.cookie("token", token).json(userDoc);
      //   }
      // );
      res.json("Pass ok");
    } else {
      res.status(422).json("Pass not ok");
    }
  } else {
    res.json("Not Found");
  }
});

app.listen(4000);