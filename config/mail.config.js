import * as dotenv from "dotenv";

dotenv.config();

export const mail = {
  service: "hotmail",
  user: process.env.EMAIL_ADDRESS,
  pass: process.env.EMAIL_PASSWORD,
};
