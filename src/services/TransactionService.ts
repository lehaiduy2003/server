import { ObjectId } from "mongodb";
import { ClientSession } from "mongoose";

import BaseService from "./BaseService";

import Transactions from "../models/Transactions";
import { ITransaction, Transaction } from "../libs/zod/models/Transaction";

import { TransactionDTO } from "../libs/zod/dto/TransactionDTO";
import { TransactionUpdateDTO } from "../libs/zod/dto/TransactionUpdateDTO";

export default class TransactionService extends BaseService<ITransaction> {
  private static transactionModel = Transactions.getInstance();

  /**
   * @param {[products:{id: ObjectId, img: string, name: string, price: number, quantity: number}]} products
   * @param {id: ObjectId, address: string, phone: string, name: string} buyer
   * @param {id: ObjectId, address: string, phone: string, name: string} seller
   * @returns {Promise<Document<Transactions> | null>}
   */
  static async createTransaction(transactionDTO: TransactionDTO): Promise<Transaction | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const transaction: Transaction | null = await this.transactionModel.insert(transactionDTO, this.getSession());
      if (!transaction || transaction === null) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return transaction;
    } catch (error) {
      await this.abortTransaction();
      console.error("error while create transaction: ", error);
      return null;
    } finally {
      await this.endSession();
    }
  }

  static async updateTransactionById(transaction_id: ObjectId, data: TransactionUpdateDTO): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      const isUpdatedTransaction = await this.transactionModel.updateByUnique(
        "_id",
        transaction_id,
        data,
        this.getSession()
      );
      if (isUpdatedTransaction === false) {
        await this.abortTransaction();
        return false;
      }
      await this.commitTransaction();
      return isUpdatedTransaction;
    } catch (error) {
      await this.abortTransaction();
      console.error("error while updating transaction: ", error);
      return false;
    } finally {
      await this.endSession();
    }
  }
}
