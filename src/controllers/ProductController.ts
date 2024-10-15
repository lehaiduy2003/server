import { Request, Response } from "express";

import BaseController from "./BaseController";
import ProductService from "../services/ProductService";

import { saveToCache } from "../libs/redis/cacheSaving";
import { validateFilter } from "../libs/zod/Filter";

export default class ProductController extends BaseController {
  /**
   * get products (for no search query params (sort, order, find by, etc) provided by user - homepage, user products, etc)
   * @param req request containing query params (limit, skip, page)
   * @param res response containing products
   */
  public override async get(req: Request, res: Response): Promise<void> {
    //this.checkReqBody(req, res);
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;

      const products = await ProductService.getProducts(
        limit,
        skip,
        page // for pagination (infinite scrolling)
      );

      if (!products || (Array.isArray(products) && products.length === 0)) {
        res.status(404).send({ message: "No products found" });
      } else res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }

  /**
   * for searching products based on query params (sort, order, find by, etc)
   * @param req request containing query params (limit, skip, page, sort, order, find by, etc)
   * @param res response containing products
   */
  async search(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const parsedFilter = validateFilter(req.query);

      const products = await ProductService.search(parsedFilter);

      if (!products || products.length === 0) {
        res.status(404).send({ message: "No products found" });
        return;
      }

      await saveToCache(req.body.cacheKey, products);

      res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }
}
