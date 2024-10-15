import jwt from "jsonwebtoken";
import { Payload } from "../zod/Payload";

export default function decodeToken(token: string): Payload {
  try {
    const payload = jwt.decode(token) as Payload;
    return payload;
  } catch (error) {
    console.error(error);
    throw new Error("cannot decode token");
  }
}
