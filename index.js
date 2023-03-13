const express = require("express");
const app = express();
const cors = require("cors");
const bp = require("body-parser");
const nodemailer = require("nodemailer");

const EMAIL = "rohanverma264@gmail.com"
const PASS = "bqzoeogpnmtzowkt"

const port = process.env.PORT || 5000;

const db = require("./models");
const { Enquiry } = require("./models");
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL,
    pass: PASS,
  },
});

app.post("/enquiry", (req, res) => {
  console.log(req.body);
  const { name, email, phone, city, message } = req.body;
  Enquiry.create({ name, email, phone, city, message })
    .then(async (resp) => {
      transporter
        .sendMail({
          from: EMAIL, // sender address
          to: "webir68070@luxeic.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        })
        .then(() => console.log("Email sent"))
        .catch((err) => console.log("Email error : ", err));
      res.send(resp);
    })
    .catch((err) => res.send(err));
});

db.sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log("Server is started at " + port);
    });
  })
  .catch((err) => {
    console.log("Server error.");
  });
