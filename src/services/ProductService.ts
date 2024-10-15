import Products from "../models/Products";
import { ClientSession } from "mongoose";

import BaseService from "./BaseService";

import { IProduct, Product } from "../libs/zod/models/Product";
import { Filter, validateFilter } from "../libs/zod/Filter";

import { SearchResultDTO, validateSearchResultDTO } from "../libs/zod/dto/SearchResultDTO";

export default class ProductService extends BaseService<IProduct> {
  private static productModel = Products.getInstance();

  public static async getProducts(limit: number, skip: number, page: number): Promise<Product[] | null> {
    try {
      const filter: Filter = validateFilter({ limit, skip, page });
      const products: Product[] | null = await this.productModel.findWithFilter(filter);

      return products;
    } catch (error) {
      console.error("Error getting homepage data:", error);
      throw error;
    }
  }

  public static async search(filter: Filter): Promise<SearchResultDTO[] | null> {
    const products: Product[] = await this.productModel.findSearchedProducts(filter);

    const result = products.map((product) => {
      return validateSearchResultDTO(product);
    });

    return result;
  }
}
