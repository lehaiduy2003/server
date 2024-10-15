import { ObjectId } from "mongodb";
import { ClientSession } from "mongoose";
import UserProfilesModel from "../models/UserProfilesModel";

import BaseService from "./init/BaseService";

import { UserProfile, validateUserProfile } from "../libs/zod/model/UserProfile";
import { keyValue } from "../libs/zod/keyValue";

export default class UserProfileService extends BaseService<UserProfilesModel, UserProfile> {
  public constructor() {
    super("user");
  }

  public override async readOne(field: keyof UserProfile, keyValue: keyValue): Promise<UserProfile | null> {
    return await this.getModel().findByUnique(field, keyValue);
  }

  /**
   * for creating a new user profile
   * @param account_id
   * @param session
   * @returns
   */
  async createUserProfile(account_id: ObjectId, session: ClientSession): Promise<UserProfile | null> {
    const userProfileData = validateUserProfile({
      account_id: account_id,
    });
    return await this.getModel().insert(userProfileData, session);
  }

  /**
   * Check if user profile exist, return true if exist, false otherwise
   * @param accountId
   * @returns
   */
  async isUserProfileExist(accountId: ObjectId): Promise<boolean> {
    const userProfile = await this.getModel().findUserProfileByAccountId(accountId);
    return userProfile !== null;
  }
}
