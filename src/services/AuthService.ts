import { ObjectId } from "mongodb";
import { ClientSession } from "mongoose";

import BaseService from "./BaseService";

import Accounts from "../models/Accounts";
import UserProfiles from "../models/UserProfiles";

import hashPassword from "../libs/crypto/passwordHashing";
import verifyPassword from "../libs/crypto/passwordVerifying";

import generateTokens from "../libs/jwt/tokensGenerating";
import refreshAccessToken from "../libs/jwt/tokenRefreshing";

import { AuthDTO, validateAuthDTO } from "../libs/zod/dto/AuthDTO";
import { IUserProfile, UserProfile, validateUserProfile } from "../libs/zod/models/UserProfile";
import { Account, IAccount, validateAccount } from "../libs/zod/models/Account";
import AccountService from "./AccountService";
import UserProfileService from "./UserProfileService";
import { keyValue } from "../libs/zod/keyValue";

interface IAuthService extends IAccount, IUserProfile {}

/**
 * Responsible for handling the authentication process.
 * ``It supported by the AccountService and UserProfileService``.
 * ``The main transaction is handled by the BaseService, which is extended by this class``.
 * @class AccountService
 * @class UserProfileService
 */
export default class AuthService extends BaseService<IAuthService> {
  private static userModel = UserProfiles.getInstance();
  private static accountModel = Accounts.getInstance();

  static getNewAccessToken(token: string) {
    return refreshAccessToken(token);
  }

  async create(data: Partial<IAuthService>): Promise<IAuthService> {
    throw new Error("Method not implemented.");
  }

  static async signUp(data: Partial<Account>): Promise<AuthDTO | null> {
    await this.startSession();
    this.startTransaction();
    const session = this.getSession();
    try {
      if (await AccountService.isAccountExist(String(data.email))) {
        await this.abortTransaction();
        return null;
      }

      const newAccount = await AccountService.createAccount(data, session);
      if (!newAccount) {
        await session.abortTransaction();
        return null;
      }

      const newUser = await UserProfileService.createUserProfile(new ObjectId(String(newAccount._id)), session);
      if (!newUser) {
        await session.abortTransaction();
        return null;
      }

      const tokens = generateTokens(String(newAccount._id), newAccount.role);

      await session.commitTransaction();
      return validateAuthDTO({
        account_id: String(newAccount._id),
        user_id: String(newUser._id),
        ...tokens,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Error during sign up:");
      throw error;
    } finally {
      await session.endSession();
    }
  }
  static async signIn(email: string, password: string): Promise<AuthDTO | null> {
    try {
      const account = await AccountService.getAccountByEmail(email);

      if (account === null || account.status === "inactive") {
        return null;
      }

      const isPasswordValid = AccountService.verifyAccountPassword(account, password);
      const accountId = new ObjectId(String(account._id));

      if (!isPasswordValid || !(await UserProfileService.isUserProfileExist(accountId))) {
        return null; // User not found or password is invalid
      }

      const tokens = generateTokens(String(account._id), account.role);
      return validateAuthDTO({ account_id: String(account._id), ...tokens });
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  }

  // FIXME: This method is deleting the user profile and account,
  // but it should delete all the user data (transactions, products, etc) also
  static async deleteAccount(user_id: string): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      const isDeletedAccount = await AccountService.deleteAccountById(user_id);
      if (!isDeletedAccount) {
        await this.abortTransaction();
        return false;
      }

      const isDeletedUserProfile = await this.userModel.deleteByUnique("account_id", user_id, this.getSession());

      if (!isDeletedUserProfile) {
        await this.abortTransaction();
        return false;
      }

      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      console.error("error while deleting account: ", error);
      return false;
    } finally {
      await this.endSession();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Check if user profile exist, return true if exist, false otherwise
   * @param accountId
   * @returns
   */
  private static async checkUserProfileExist(accountId: ObjectId): Promise<boolean> {
    const userProfile = await this.userModel.findUserProfileByAccountId(accountId);
    return userProfile !== null;
  }
  private static async checkAccountExist(email: string): Promise<boolean> {
    const account = await this.accountModel.findAccountByEmail(email);
    return account !== null;
  }
  private static isAccountActive(account: Account | null): boolean {
    return account !== null && account.status !== "inactive";
  }

  private static verifyAccountPassword(account: Account, password: string): boolean {
    const [passwordSalt, passwordHash] = account.password.split(":");
    return verifyPassword(password, passwordSalt, passwordHash);
  }

  /**
   * for creating a new account
   * @param data
   * @param session
   * @returns
   */
  private static async createAccount(data: Partial<Account>, session: ClientSession): Promise<Account | null> {
    const hashedPassword = hashPassword(String(data.password));
    const accountData = validateAccount({
      email: String(data.email),
      password: hashedPassword,
      role: data.role,
    });
    return await this.accountModel.insert(accountData, session);
  }

  /**
   * for creating a new user profile
   * @param account_id
   * @param session
   * @returns
   */
  private static async createUserProfile(account_id: string, session: ClientSession): Promise<UserProfile | null> {
    const userProfileData = validateUserProfile({
      account_id: account_id,
    });
    return await this.userModel.insert(userProfileData, session);
  }
}
