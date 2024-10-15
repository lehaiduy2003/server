import ProductsModel from "../models/ProductsModel";

import BaseService from "./init/BaseService";

import { Product } from "../libs/zod/model/Product";
import { Filter, validateFilter } from "../libs/zod/Filter";

import { SearchResultDTO, validateSearchResultDTO } from "../libs/zod/dto/SearchResultDTO";

export default class ProductService extends BaseService<ProductsModel> {
  public constructor() {
    super("product");
  }

  public async getProducts(limit: number, skip: number, page: number): Promise<Product[] | null> {
    try {
      const filter: Filter = validateFilter({ limit, skip, page });
      const products: Product[] | null = await this.getModel().findWithFilter(filter);

      return products;
    } catch (error) {
      console.error("Error getting homepage data:", error);
      throw error;
    }
  }

  public async search(filter: Filter): Promise<SearchResultDTO[] | null> {
    const products: Product[] = await this.getModel().findSearchedProducts(filter);

    const result = products.map((product) => {
      return validateSearchResultDTO(product);
    });

    return result;
  }
}
