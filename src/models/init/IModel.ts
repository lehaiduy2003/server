import { ClientSession } from "mongoose";

export default interface IModel<K> {
  // search
  findAll(): Promise<any[] | null>;
  findByUnique(field: keyof K, keyValue: any): Promise<Partial<K> | null>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update
  updateByUnique(field: keyof K, keyValue: any, data: any, session: ClientSession): Promise<boolean>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete
  deleteByUnique(field: keyof K, keyValue: any, session: ClientSession): Promise<boolean>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // insert
  insert(data: any, session: ClientSession): Promise<Partial<K> | null>;
}
