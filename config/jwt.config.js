import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export function GenerateToken(props) {
  const { _id, name, email, role } = props;

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  return jwt.sign({ _id, name, email, role }, signature, {
    expiresIn: expiration,
  });
}
