// server/models/product.js
import { Schema, SortOrder } from "mongoose";
import BaseModel from "./BaseModel";
import { IProduct, Product } from "../libs/zod/models/Product";
import { Filter } from "../libs/zod/Filter";

const productsSchema: Schema<Product> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  description: {
    content: { type: String, required: true },
    imgs: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String, required: true },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

productsSchema.index({ price: 1 });
productsSchema.index({ createAt: -1 });
productsSchema.index({ type: 1 });

export default class Products extends BaseModel<IProduct> {
  private static instance: Products;

  private constructor() {
    super("Products", productsSchema);
  }

  public static getInstance(): Products {
    if (!Products.instance) {
      Products.instance = new Products();
    }
    return Products.instance;
  }

  public async findSearchedProducts(filter: Filter): Promise<Product[]> {
    try {
      const results = await this.getModel().aggregate([
        {
          $search: {
            index: "product_name",
            text: {
              query: filter.query,
              path: "name",
              fuzzy: { maxEdits: 1 },
            },
          },
        },
        { $sort: { [filter.sort]: filter.orderBy === "asc" ? 1 : -1 } },
        { $limit: filter.limit },
        { $skip: filter.skip },
      ]);

      return results;
    } catch (error) {
      console.error("Error getting sorted and filtered results: ", error);
      throw error;
    }
  }
}
