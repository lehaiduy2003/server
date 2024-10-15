import { Request, Response } from "express";

import BaseController from "./BaseController";
import TransactionService from "../services/TransactionService";

import { validateTransaction } from "../libs/zod/models/Transaction";
import { validateTransactionUpdateDTO } from "../libs/zod/dto/TransactionUpdateDTO";
import { validateTransactionDTO } from "../libs/zod/dto/TransactionDTO";

export default class TransactionController extends BaseController {
  /**
   * Not implemented
   * @param req
   * @param res
   */
  // TODO: Implement get method for get transactions history
  public override get(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  /**
   * for creating a transaction
   * @param req request containing transaction data (products, buyer, seller)
   * @param res response containing created transaction info
   */
  public override async post(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const parsedTransaction = validateTransactionDTO(req.body);

      const transaction = await TransactionService.createTransaction(parsedTransaction);

      if (!transaction) res.status(502).send({ message: "No transaction created" });
      else res.status(201).send(transaction);
    } catch (error) {
      this.error(error, res);
    }
  }
  /**
   * for updating a transaction data (restricted to updating status only)
   * @param req request containing transaction id and data to update (check if the user is authorized to update the transaction)
   * @param res response containing success message
   */
  public override async put(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    this.checkReqParams(req, res);
    try {
      const { id } = req.params;
      const parsedTransactionUpdateDTO = validateTransactionUpdateDTO({ _id: id, ...req.body });

      const updatedTransaction: boolean = await TransactionService.updateTransactionById(
        parsedTransactionUpdateDTO._id,
        parsedTransactionUpdateDTO
      );

      if (updatedTransaction === false) res.status(502).send({ message: "No transaction updated" });
      else res.status(200).send({ message: "Transaction updated successfully" });
    } catch (error) {
      this.error(error, res);
    }
  }
  /**
   * Not implemented
   * @param req
   * @param res
   */
  // TODO: Implement delete method for delete transaction history (only for transaction status = "cancelled" or "completed")
  public override delete(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
