import { keyValue } from "../libs/zod/keyValue";
import { Filter } from "../libs/zod/Filter";

export default interface IService<T> {
  create(data: Partial<T>): Promise<T>;
  read(field: keyof T, keyValue: keyValue, filter: Filter): Promise<T[]>;
  update(field: keyof T, keyValue: keyValue, data: Partial<T>): Promise<T>;
  delete(field: keyof T, keyValue: keyValue): Promise<T>;
}
