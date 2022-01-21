import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import initialState from './products.initial-state';
import { api, API_URL } from './../../api';
import { DEFAULT_FETCH_LIMIT } from '../../variables';
import { fetchWithErrorHandling } from '../../utils';

import { Id, Product } from '../../declarations';
import {
  CreateProductParams,
  DeleteProductParams,
  FetchProductsParams,
  PatchProductParams,
} from './products.declarations';
import { RootState } from '..';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, filters: { search } }: FetchProductsParams) => {
    const products: { total: number; data: Product[] } = (
      await axios.get(api.products, {
        params: {
          $skip: page * DEFAULT_FETCH_LIMIT - DEFAULT_FETCH_LIMIT,
          $order: {
            updatedAt: 'DESC',
          },
          name: {
            $iLike: `%${search}%`,
          },
        },
      })
    ).data;

    return {
      total: products.total,
      products: products.data.map((product) =>
        product.upload
          ? { ...product, path: API_URL + product.upload.path }
          : product
      ),
    };
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async ({ data, accessToken }: CreateProductParams, { rejectWithValue }) => {
    const uploadId = data.uploadId === -1 ? undefined : data.uploadId;

    return await fetchWithErrorHandling(async () => {
      await axios.post(
        api.products,
        { ...data, uploadId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }, rejectWithValue);
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (
    { productId, accessToken }: DeleteProductParams,
    { rejectWithValue }
  ) => {
    return await fetchWithErrorHandling(async () => {
      await axios.delete(api.products + `/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }, rejectWithValue);
  }
);

export const patchProduct = createAsyncThunk(
  'products/patchProduct',
  async ({ data, accessToken }: PatchProductParams, { rejectWithValue }) => {
    return await fetchWithErrorHandling(async () => {
      await axios.patch(
        api.products + `/${data.id}`,
        { ...data, upload: undefined },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }, rejectWithValue);
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.writeData.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.writeData.description = action.payload;
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.writeData.price = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.writeData.height = action.payload;
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      state.writeData.birthdate = action.payload;
    },
    setCategoryId: (state, action: PayloadAction<Id>) => {
      state.writeData.categoryId = action.payload;
    },
    setUploadId: (state, action: PayloadAction<Id>) => {
      state.writeData.uploadId = action.payload;
    },
    clearProductCreate: (state) => {
      state.writeData = initialState.writeData;
      state.createLoading = 'idle';
      state.createSuccess = false;
      state.createError = undefined;
    },
    clearProductCreateError: (state) => {
      state.createError = undefined;
    },
    clearDelete: (state) => {
      state.deleteLoading = 'idle';
      state.deleteSuccess = false;
      state.deleteError = undefined;
    },
    clearProductEdit: (state) => {
      state.writeData = initialState.writeData;
      state.editLoading = 'idle';
      state.editSuccess = false;
      state.editError = undefined;
    },
    clearProductEditError: (state) => {
      state.editError = undefined;
    },
    setWriteData: (state, action: PayloadAction<Partial<Product>>) => {
      const product = action.payload;

      state.writeData = { ...product, price: +(product.price || 0) };
    },
    clearWriteData: (state) => {
      state.writeData = initialState.writeData;
    },
  },
  extraReducers: {
    [fetchProducts.pending as any]: (state) => {
      state.loading = 'pending';
      state.error = undefined;
    },
    [fetchProducts.fulfilled as any]: (
      state,
      {
        payload: { products, total },
      }: PayloadAction<{ total: number; products: Product[] }>
    ) => {
      state.loading = 'idle';
      state.data = products;
      state.total = total;
    },
    [fetchProducts.rejected as any]: (state, action: PayloadAction<string>) => {
      state.loading = 'idle';
      state.error = action.payload;
    },
    [createProduct.pending as any]: (state) => {
      state.createLoading = 'pending';
      state.createError = undefined;
      state.createSuccess = false;
    },
    [createProduct.fulfilled as any]: (state) => {
      state.createLoading = 'idle';
      state.createSuccess = true;
    },
    [createProduct.rejected as any]: (state, action: PayloadAction<string>) => {
      state.createLoading = 'idle';
      state.createError = action.payload;
    },
    [deleteProduct.pending as any]: (state) => {
      state.deleteLoading = 'pending';
      state.deleteError = undefined;
      state.deleteSuccess = false;
    },
    [deleteProduct.fulfilled as any]: (state) => {
      state.deleteLoading = 'idle';
      state.deleteSuccess = true;
    },
    [deleteProduct.rejected as any]: (state, action: PayloadAction<string>) => {
      state.deleteLoading = 'idle';
      state.deleteError = action.payload;
    },
    [patchProduct.pending as any]: (state) => {
      state.editLoading = 'pending';
      state.editError = undefined;
      state.editSuccess = false;
    },
    [patchProduct.fulfilled as any]: (state) => {
      state.editLoading = 'idle';
      state.editSuccess = true;
    },
    [patchProduct.rejected as any]: (state, action: PayloadAction<string>) => {
      state.editLoading = 'idle';
      state.editError = action.payload;
    },
  },
});

export const {
  setSearch,
  setName,
  setDescription,
  setPrice,
  setCategoryId,
  setUploadId,
  clearProductCreate,
  setHeight,
  setBirthdate,
  clearProductCreateError,
  clearDelete,
  clearProductEdit,
  clearProductEditError,
  setWriteData,
  clearWriteData,
} = productsSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.products.loading === 'pending';
export const selectProducts = (state: RootState) => state.products.data;
export const selectTotal = (state: RootState) => state.products.total;
export const selectSearch = (state: RootState) => state.products.filters.search;
export const selectFilters = (state: RootState) => state.products.filters;
export const selectName = (state: RootState) => state.products.writeData.name;
export const selectDescription = (state: RootState) =>
  state.products.writeData.description;
export const selectCategoryId = (state: RootState) =>
  state.products.writeData.categoryId;
export const selectUploadId = (state: RootState) =>
  state.products.writeData.uploadId;
export const selectPrice = (state: RootState) => state.products.writeData.price;
export const selectHeight = (state: RootState) =>
  state.products.writeData.height;
export const selectBirthdate = (state: RootState) =>
  state.products.writeData.birthdate;
export const selectCreateSuccess = (state: RootState) =>
  state.products.createSuccess;
export const selectCreateError = (state: RootState) =>
  state.products.createError;
export const selectDeleteSuccess = (state: RootState) =>
  state.products.deleteSuccess;
export const selectDeleteError = (state: RootState) =>
  state.products.deleteError;
export const selectEditSuccess = (state: RootState) =>
  state.products.editSuccess;
export const selectEditError = (state: RootState) => state.products.editError;

export default productsSlice.reducer;
