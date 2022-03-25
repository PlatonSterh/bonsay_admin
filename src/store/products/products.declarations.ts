import { Id, Product } from '@app/declarations';

interface ProductsFilters {
  search: string;
  categoryId: Id;
}

export interface ProductsState {
  total: number;
  data: Product[];
  loading: 'idle' | 'pending';
  error?: string;
  filters: ProductsFilters;

  writeData: Partial<Product> & { photosUploadsIds: Id[] };

  createLoading: 'idle' | 'pending';
  createError?: string;
  createSuccess: boolean;

  deleteLoading: 'idle' | 'pending';
  deleteError?: string;
  deleteSuccess: boolean;

  editLoading: 'idle' | 'pending';
  editError?: string;
  editSuccess: boolean;

  page: number;
}

export type FetchProductsParams = {
  page: number;
  filters: ProductsFilters;
};

export type CreateProductParams = {
  data: {
    name?: string;
    description?: string;
    price?: number;
    height?: number;
    birthdate?: string;
    categoryId?: Id;
    uploadId?: Id;
    photosUploadsIds?: Id[];
  };
  accessToken?: string;
};

export type DeleteProductParams = {
  productId: Id;
  accessToken: string;
};

export type PatchProductParams = {
  data: {
    id: Id;
    name?: string;
    description?: string;
    price?: number;
    height?: number;
    birthdate?: string;
    categoryId?: Id;
    uploadId?: Id;
    photosUploadsIds?: Id[];
  };
  accessToken: string;
};

export type SuccessCreation = { data: { id: Id } };
