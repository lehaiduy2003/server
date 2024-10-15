import mongoose, { ClientSession } from "mongoose";
import IService from "./IService";
import { Filter } from "../libs/zod/Filter";
import { keyValue } from "../libs/zod/keyValue";

// for isolation of transaction
export default abstract class BaseService<T> implements IService<T> {
  create(data: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read(field: never, keyValue: keyValue, filter: Filter): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  update(field: never, keyValue: keyValue, data: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }
  delete(field: never, keyValue: keyValue): Promise<T> {
    throw new Error("Method not implemented.");
  }
  private static session: ClientSession;

  public static getSession(): ClientSession {
    return BaseService.session;
  }

  public static async startSession(): Promise<void> {
    BaseService.session = await mongoose.startSession();
  }

  public static startTransaction(): void {
    BaseService.session.startTransaction();
  }

  public static async commitTransaction(): Promise<void> {
    await BaseService.session.commitTransaction();
  }

  public static async abortTransaction(): Promise<void> {
    await BaseService.session.abortTransaction();
  }

  public static async endSession(): Promise<void> {
    await BaseService.session.endSession();
  }
}
