import { Types } from "mongoose";
import { z } from "zod";

export const AuthDTOSchema = z.object({
  account_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  user_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  name: z.string(),
  avatar: z.string().url(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const validateAuthDTO = (data: unknown) => {
  const result = AuthDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type AuthDTO = z.infer<typeof AuthDTOSchema>;
