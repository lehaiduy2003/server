import { Types } from "mongoose";
import { z } from "zod";

export const TraderDTOSchema = z.object({
  _id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
});

export const validateTraderDTO = (data: unknown) => {
  const result = TraderDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type TraderDTO = z.infer<typeof TraderDTOSchema>;
