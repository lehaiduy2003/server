// server/models/product.js
import { Schema } from "mongoose";

import BaseModel from "./BaseModel";

import { Account, IAccount, RecyclerField } from "../libs/zod/models/Account";

const accountsSchema: Schema<Account> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "recycler", "admin"],
    default: "customer",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  isVerified: { type: Boolean, required: true, default: false },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  recyclerField: {
    recyclingLicenseNumber: { type: String },
    recyclingCapacity: { type: Number },
  },
});

// Pre-save hook to check account type and conditionally add fields
accountsSchema.pre("save", function (next) {
  if (this.role === "recycler") {
    if (!this.recyclerField || !this.recyclerField.recyclingLicenseNumber || !this.recyclerField.recyclingCapacity) {
      return next(new Error("recyclerField is required when role is recycler"));
    }
  }
  next();
});

// Create indexes
accountsSchema.index({ email: 1 }, { unique: true });
accountsSchema.index({ role: 1 });
accountsSchema.index({ createAt: 1 });

export default class Accounts extends BaseModel<IAccount> {
  private recyclerField?: RecyclerField;
  private static instance: Accounts;

  private constructor() {
    super("Accounts", accountsSchema);
    this.recyclerField = this.recyclerField || {
      recyclingLicenseNumber: "",
      recyclingCapacity: 0,
    };
  }

  public static getInstance(): Accounts {
    if (!Accounts.instance) {
      Accounts.instance = new Accounts();
    }
    return Accounts.instance;
  }

  public async findAccountByEmail(email: string): Promise<Account | null> {
    const result: Account | null = await this.findByUnique("email", email);
    return result;
  }
}
