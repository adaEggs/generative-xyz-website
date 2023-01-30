import { Product } from '@interfaces/product';

export interface IGetProductListResponse {
  products: Array<Product>;
  total: number;
}
