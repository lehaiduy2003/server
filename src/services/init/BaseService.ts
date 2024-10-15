import mongoose, { ClientSession } from "mongoose";
import IService from "./IService";
import { Filter } from "../../libs/zod/Filter";
import { keyValue } from "../../libs/zod/keyValue";
import ModelFactory from "../../models/init/ModelFactory";
import { validateServiceModelType } from "../../libs/zod/ServiceModelType";

/**
 * for isolation of transaction
 * BaseService class provides common service operations for various models.
 * It handles session management and model instantiation.
 * @param T: Model instance
 */
export default abstract class BaseService<T, K> implements IService<K> {
  private session: ClientSession | undefined;
  private model: T;

  protected constructor(modelType?: string) {
    if (modelType === undefined) {
      throw new Error("Model type must be provided.");
    }
    this.model = ModelFactory.createModel(validateServiceModelType(modelType)) as T;
  }

  public getSession(): ClientSession {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    return this.session;
  }

  public getModel(): T {
    return this.model;
  }
  public async startSession(): Promise<void> {
    this.session = await mongoose.startSession();
  }

  public startTransaction(): void {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    this.session.startTransaction();
  }

  public async commitTransaction(): Promise<void> {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    await this.session.commitTransaction();
  }

  public async abortTransaction(): Promise<void> {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    await this.session.abortTransaction();
  }

  public async endSession(): Promise<void> {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    await this.session.endSession();
  }

  async create(data: Partial<K>, session: ClientSession): Promise<K> {
    throw new Error("Method not implemented.");
  }
  async read(field: keyof K, keyValue: keyValue, filter: Filter): Promise<K[]> {
    throw new Error("Method not implemented.");
  }
  readOne(field: keyof K, keyValue: keyValue): Promise<K | null> {
    throw new Error("Method not implemented.");
  }
  async update(field: keyof K, keyValue: keyValue, data: Partial<K>, session: ClientSession): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async delete(field: keyof K, keyValue: keyValue, session: ClientSession): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
