import { keyValue } from "../../libs/zod/keyValue";
import { Filter } from "../../libs/zod/Filter";

export default interface IService {
  create(data: any): Promise<any>;
  read(field: keyof any, keyValue: keyValue, filter: Filter): Promise<any[]>;
  readOne(field: keyof any, keyValue: keyValue): Promise<any | null>;
  update(field: keyof any, keyValue: keyValue, data: Partial<any>): Promise<boolean>;
  delete(field: keyof any, keyValue: keyValue): Promise<boolean>;
}
