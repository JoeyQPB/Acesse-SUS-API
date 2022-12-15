import path from "path";
// const path = required("path");

import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");

import hbs from "nodemailer-express-handlebars";
// const hbs = require("nodemailer-express-handlebars");

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
export { transport };
