import { useEffect } from 'react';
import { Table, Tbody, useToast } from '@chakra-ui/react';

import TableHead from '@components/table-head.component';
import TableRow from '@components/table-row.component';
import Pagination from '@components/pagination.component';
import LoadingHandler from '@components/loading-handler.component';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  fetchProducts,
  selectProducts,
  selectSearch,
  selectTotal,
  selectCreateSuccess,
  deleteProduct,
  selectDeleteSuccess,
  selectDeleteError,
  clearDelete,
  selectEditSuccess,
  selectIsLoading,
  selectPage,
  setPage,
  selectCategoryIdFilter,
  selectStateFilter,
} from '@store/products/products.slice';
import { selectAccessToken } from '@store/core/core.slice';
import getProductsTableData from '@app/table-data/get-products-table-data';

import { Id } from '@app/declarations';

export const Products = () => {
  const pageNumber = useAppSelector(selectPage);

  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const total = useAppSelector(selectTotal);
  const search = useAppSelector(selectSearch);
  const categoryIdFilter = useAppSelector(selectCategoryIdFilter);
  const stateFilter = useAppSelector(selectStateFilter);
  const productCreateSuccess = useAppSelector(selectCreateSuccess);
  const productDeleteSuccess = useAppSelector(selectDeleteSuccess);
  const productEditSuccess = useAppSelector(selectEditSuccess);
  const productDeleteError = useAppSelector(selectDeleteError);

  const accessToken = useAppSelector(selectAccessToken);

  const toast = useToast();

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: pageNumber,
        filters: { search, categoryId: categoryIdFilter, state: stateFilter },
      })
    );
  }, [dispatch, pageNumber, search, categoryIdFilter, stateFilter]);

  useEffect(() => {
    if (productCreateSuccess || productDeleteSuccess || productEditSuccess) {
      dispatch(
        fetchProducts({
          page: pageNumber,
          filters: { search, categoryId: categoryIdFilter, state: stateFilter },
        })
      );

      dispatch(setPage(1));
    }
  }, [
    dispatch,
    pageNumber,
    search,
    productCreateSuccess,
    productDeleteSuccess,
    productEditSuccess,
    categoryIdFilter,
    stateFilter,
  ]);

  useEffect(() => {
    setPage(1);
  }, [dispatch]);

  useEffect(() => {
    if (productDeleteSuccess) {
      toast({
        title: 'Товар удалён.',
        status: 'success',
        position: 'bottom-right',
      });

      dispatch(clearDelete());
    }
  }, [dispatch, toast, productDeleteSuccess]);

  useEffect(() => {
    if (productDeleteError) {
      toast({
        title: 'Что-пошло не так.',
        status: 'error',
        position: 'bottom-right',
      });

      dispatch(clearDelete());
    }
  }, [dispatch, toast, productDeleteError]);

  const onPageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const onDelete = (productId: Id) => {
    if (accessToken) {
      dispatch(deleteProduct({ productId, accessToken }));
    }
  };

  const isLoading = useAppSelector(selectIsLoading);

  return (
    <LoadingHandler isLoading={isLoading}>
      <Table variant="simple" maxH="80vh" overflow="hidden">
        <TableHead
          titles={['Картинка', 'Название', 'Цена', 'Состояние', 'Действия']}
        />
        <Tbody>
          {products.map((product) => {
            return (
              <TableRow
                key={product.id}
                data={getProductsTableData(product, onDelete)}
              />
            );
          })}
        </Tbody>
      </Table>
      <Pagination
        pageNumber={pageNumber}
        total={total}
        setPage={onPageChange}
      />
    </LoadingHandler>
  );
};

export default Products;
