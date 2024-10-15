import BaseService from "./BaseService";
import { ObjectId } from "mongodb";
import { ClientSession } from "mongoose";
import UserProfiles from "../models/UserProfiles";
import { IUserProfile, UserProfile, validateUserProfile } from "../libs/zod/models/UserProfile";

export default class UserProfileService extends BaseService<IUserProfile> {
  private static userModel = UserProfiles.getInstance();

  /**
   * for creating a new user profile
   * @param account_id
   * @param session
   * @returns
   */
  static async createUserProfile(account_id: string, session: ClientSession): Promise<UserProfile | null> {
    const userProfileData = validateUserProfile({
      account_id: account_id,
    });
    return await this.userModel.insert(userProfileData, session);
  }

  /**
   * Check if user profile exist, return true if exist, false otherwise
   * @param accountId
   * @returns
   */
  static async isUserProfileExist(accountId: ObjectId): Promise<boolean> {
    const userProfile = await this.userModel.findUserProfileByAccountId(accountId);
    return userProfile !== null;
  }
}
