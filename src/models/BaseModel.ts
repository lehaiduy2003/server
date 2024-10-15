import mongoose, { ClientSession, Document, FilterQuery, Model, Schema } from "mongoose";
import { Filter } from "../libs/zod/Filter";
import { keyValue } from "../libs/zod/keyValue";

export default abstract class BaseModel<T extends Document> {
  private model: Model<T>;
  protected constructor(name: string, Schema: Schema<T>) {
    this.model = mongoose.model<T>(name, Schema);
  }
  public getModel(): Model<T> {
    return this.model;
  }

  public async updateByUnique(
    field: keyof T,
    keyValue: keyValue,
    data: Partial<T>,
    session: ClientSession
  ): Promise<boolean> {
    try {
      const result = await this.model.updateOne({ [field]: keyValue } as FilterQuery<T>, data, {
        session,
      });
      return result.modifiedCount > 0;
    } catch (error) {
      console.error(`Error while updating ${keyValue} of ${field.toString()}`);
      return false;
    }
  }

  public async findByUnique(field: keyof T, keyValue: keyValue): Promise<T | null> {
    try {
      const result = await this.model.findOne({ [field]: keyValue } as FilterQuery<T>);
      return result;
    } catch (error) {
      console.error(`Error while finding ${keyValue} of ${field.toString()}`, error);
      return null;
    }
  }

  public async deleteByUnique(field: keyof T, keyValue: keyValue, session: ClientSession): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete({ [field]: keyValue } as FilterQuery<T>, {
        session,
      });

      console.log("result", result);

      return result !== null && (result as any).deletedCount > 0;
    } catch (error) {
      console.error(`Error while deleting ${keyValue} of ${field.toString()}`, error);
      return false;
    }
  }

  public async insert(data: Partial<T>, session: ClientSession): Promise<T | null> {
    try {
      const result = await this.model.create([data], { session });
      return result[0] as T;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<T[] | null> {
    try {
      const results = await this.model.find();
      return results;
    } catch (error) {
      return null;
    }
  }

  public async findWithFilter(filter: Filter, field?: keyof T, keyValue?: keyValue): Promise<T[] | null> {
    const filterQuery: FilterQuery<T> = field && keyValue ? ({ [field as keyof T]: keyValue } as FilterQuery<T>) : {};
    try {
      const results = await this.model
        .find(filterQuery)
        .sort({ [filter.sort]: filter.orderBy } as FilterQuery<T>)
        .limit(filter.limit)
        .skip(filter.skip);

      return results as T[];
    } catch (error) {
      console.error(`Error while finding with filter ${filterQuery}`, error);
      return null;
    }
  }
}
