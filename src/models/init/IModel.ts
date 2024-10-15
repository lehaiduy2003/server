import { ClientSession } from "mongoose";

export default interface IModel {
  // search
  findAll(): Promise<any[] | null>;
  findByUnique(field: keyof any, keyValue: any): Promise<any | null>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update
  updateByUnique(field: keyof any, keyValue: any, data: any, session: ClientSession): Promise<boolean>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete
  deleteByUnique(field: keyof any, keyValue: any, session: ClientSession): Promise<boolean>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // insert
  insert(data: any, session: ClientSession): Promise<any | null>;
}
