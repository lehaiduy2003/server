import { Schema } from "mongoose";
import BaseModel from "./BaseModel";

import { ObjectId } from "mongodb";
import Accounts from "./Accounts";
import { IUserProfile, UserProfile } from "../libs/zod/models/UserProfile";
import { Account } from "../libs/zod/models/Account";

const userProfilesSchema: Schema<UserProfile> = new Schema({
  name: { type: String },
  phone: { type: String },
  avatar: { type: String },
  dob: { type: Date },
  bio: { type: String },
  address: [{ type: String }],
  reputationScore: { type: Number, default: 100, required: true },
  followers: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  bought: { type: Number, default: 0 },
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Products" }],
  payments: [{ type: Schema.Types.ObjectId, ref: "Payments" }],
  cart: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  likes: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
    },
  ],
  following: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "UserProfiles" },
      name: { type: String },
      avatar: { type: String },
    },
  ],
});

userProfilesSchema.index({ phone: 1 }, { unique: true, sparse: true });
userProfilesSchema.index({ account_id: 1 }, { unique: true });
userProfilesSchema.index({ reputationScore: 1 });

export default class UserProfiles extends BaseModel<IUserProfile> {
  private static instance: UserProfiles;

  private constructor() {
    super("UserProfiles", userProfilesSchema);
  }

  public static getInstance(): UserProfiles {
    if (!UserProfiles.instance) {
      UserProfiles.instance = new UserProfiles();
    }
    return UserProfiles.instance;
  }

  /**
   * Check the _id field of the accounts collection
   * @param account_id
   * @returns
   */
  public async findUserProfileByAccountId(account_id: ObjectId): Promise<UserProfile | null> {
    try {
      return Accounts.getInstance().getModel().findOne({ _id: account_id });
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
  public async findUserProfileByEmail(email: string): Promise<IUserProfile | null> {
    try {
      const account: Account | null = await Accounts.getInstance().findAccountByEmail(email);
      if (account) {
        return this.findUserProfileByAccountId(new ObjectId(String(account._id)));
      }
      return null;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
