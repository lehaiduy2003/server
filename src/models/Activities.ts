// server/models/product.js
import { Schema } from "mongoose";
import BaseModel from "./BaseModel";
import { IActivity } from "../libs/zod/models/Activity";

const activitiesSchema: Schema<IActivity> = new Schema({
  date: { type: Date, required: true, default: Date.now },
  log: { type: String, required: true },
  actor: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
      required: true,
    },
    role: { type: String, enum: ["customer", "admin", "recycler"] },
  },
});

activitiesSchema.index({ date: 1 });
activitiesSchema.index({ "actor.id": 1 });
activitiesSchema.index({ "actor.role": 1 });

export default class Activities extends BaseModel<IActivity> {
  private static instance: Activities;

  private constructor() {
    super("Activities", activitiesSchema);
  }

  public static getInstance(): Activities {
    if (!Activities.instance) {
      Activities.instance = new Activities();
    }
    return Activities.instance;
  }
}
