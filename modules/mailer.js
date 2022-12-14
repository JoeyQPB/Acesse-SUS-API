import path from "path";
// const path = required("path");

import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");

import hbs from "nodemailer-express-handlebars";
// const hbs = require("nodemailer-express-handlebars");

// const { host, port, user, pass } = require("../config/mail.json");
import { mail } from "../config/mail.config.js";

const { service, user, pass } = mail;

const transport = nodemailer.createTransport({
  service,
  auth: { user, pass },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve("../resources/mail/"),
    },
    viewPath: path.resolve("../resources/mail/"),
    extName: ".html",
  })
);

// module.exports = transport;

// import { mail } from "../config/mail.config.js";

// const { host, port, user, pass } = mail;

// const transportmail = nodemailer.createTransport({
//   host,
//   port,
//   auth: { user, pass },
// });

// transport.user(
//   "compile",
//   hbs({
//     viewEngine: "handlebars",
//     viewPath: path.resolve("../resources/mail"),
//     extName: ".html",
//   })
// );

export { transport };
