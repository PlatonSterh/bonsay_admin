import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

import { storeTable, useAppDispatch, useAppSelector } from '@store/hooks';
import { selectAccessToken } from '@store/core/core.slice';
import { errorMessages } from '@app/variables';

import { Category, Id, Product } from '@app/declarations';

interface UseEditOptions {
  id: Id;
  sliceName: 'products' | 'categories';
  onSuccess?: () => void;
  onError?: () => void;
  canEffect?: boolean;
}

export const useEdit = ({
  id,
  sliceName,
  onSuccess = () => {},
  onError = () => {},
  canEffect = true,
}: UseEditOptions) => {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state[sliceName].writeData);
  const accessToken = useAppSelector(selectAccessToken);

  const slices = storeTable.slices;
  const editActions = storeTable.editActions;

  const slice = slices[sliceName] as typeof slices['categories'] &
    typeof slices['products'];

  const onSave = () => {
    if (accessToken) {
      dispatch(
        slice[editActions[sliceName]]({
          data: { ...data, id } as Partial<Category> &
            Partial<Product> & { id: Id },
          accessToken,
        })
      );
    }
  };

  const toast = useToast();

  const success = useAppSelector((state) => state[sliceName].editSuccess);
  const successLabel = storeTable.labels[sliceName].successEdit;

  const successEffect = useCallback(() => {
    if (canEffect && success) {
      onSuccess();

      dispatch(slice.clearEdit());

      toast({
        title: successLabel,
        status: 'success',
        position: 'bottom-right',
      });
    }
  }, [dispatch, onSuccess, canEffect, successLabel, toast, success, slice]);

  const error = useAppSelector((state) => state[sliceName].editError);

  const errorEffect = useCallback(() => {
    if (canEffect && error) {
      onError();

      toast({
        title: Object.values(errorMessages).includes(error)
          ? error
          : 'Что-то пошло не так.',
        status: 'error',
        position: 'bottom-right',
      });

      dispatch(slice.clearEditError());
    }
  }, [dispatch, onError, canEffect, toast, error, slice]);

  return Object.freeze([onSave, successEffect, errorEffect]);
};
