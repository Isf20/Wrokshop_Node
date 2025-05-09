var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { status } = require("express/lib/response");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, new Date().getTime + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

/**Post login*/
router.post("/login", async function (req, res, next) {
  try {
    let { Email, Password } = req.body;
    let user = await userSchema.findOne({ Email: Email });
    console.log(user)
    if (!user) {
      const data = [];
      return res.status(400).json({
        message: "ไม่พบอีเมล",
        data: data,
      });
    }

    let comparePassword = await bcrypt.compare(Password, user.Password);
    if (!comparePassword) {
      const data = [];
      return res.status(400).json({
        message: "รหัสไม่ถูกต้อง",
        data: data,
      });
    }
    
    const data = {user:user}
    if(userSchema.Status  == true){
      return  res.status(200).json({
        status: true,
        message: "อนุมัติแล้ว",
        data: data,
      });

    } else{
      console.log(user)
      console.log(comparePassword)
      return res.status(400).json({
        message: "รอการอนุมัติ",
        data: data,
      });
    }

  } catch (error) {
    console.error(error);
    const data = [];
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

/**Post Register*/
router.post("/register", async function (req, res, next) {
  try {
    let { Name, PhoneNumber, Email, Password, Status } = req.body;

    let user = new userSchema({
      Name: Name,
      PhoneNumber: PhoneNumber,
      Email: Email,
      Password: await bcrypt.hash(Password, 10),
      Status: Status,
    });

    let token = await jwt.sign({ foo: "bar" }, "1234");
    await user.save();

    const data = [token];
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    const data = [];
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

router.put("/users/:id/approve", async function (req, res, next) {
  try {
    let { Name, PhoneNumber, Email, Password, Status } = req.body;
    let { id } = req.params;
    let products = await userSchema.findByIdAndUpdate(
      id,
      { Name, PhoneNumber, Email, Password, Status},
      { new: true }
    );

    console.log(products);
    const data = [products];
    res.status(200).json({
      message: "success",
      data: data,
    });

  } catch (error) {
    console.error(error);
    const data = [];
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

module.exports = router;
