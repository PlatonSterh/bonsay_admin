import { ChangeEventHandler, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';

import Dropzone from '@components/dropzone.component';
import ImagePreview from '@components/image-preview.component';
import { selectAccessToken } from '@store/core/core.slice';
import {
  selectDescription,
  selectName,
  selectUploadId,
  setDescription,
  setName,
  setUploadId,
} from '@store/categories/categories.slice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { api } from '@app/api';

export const AddCategoryForm = () => {
  const [uploadPath, setUploadPath] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const name = useAppSelector(selectName);
  const onNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch(setName(event.target.value));
  };

  const description = useAppSelector(selectDescription);
  const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    dispatch(setDescription(event.target.value));
  };

  const accessToken = useAppSelector(selectAccessToken);

  const uploadId = useAppSelector(selectUploadId);
  const onFileAccepted = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    try {
      const upload = await axios.post(api.uploads, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(setUploadId(upload.data.id));
    } catch {
      // error handling
    }
  };

  const onUploadRemove = () => {
    dispatch(setUploadId(-1));
  };

  useEffect(() => {
    if (uploadId !== -1) {
      (async () => {
        try {
          const upload = await axios.get(api.uploads + `/${uploadId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setUploadPath(upload.data.path);
        } catch {
          // error handling
        }
      })();
    } else {
      setUploadPath(null);
    }
  }, [setUploadPath, accessToken, uploadId]);

  return (
    <VStack spacing={3}>
      <FormControl>
        <FormLabel htmlFor="name">Название</FormLabel>
        <Input
          name="name"
          placeholder="Название"
          value={name}
          onChange={onNameChange}
          isInvalid={!String(name).trim()}
          errorBorderColor="crimson"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="description">Описание</FormLabel>
        <Textarea
          name="description"
          placeholder="Описание"
          value={description}
          onChange={onDescriptionChange}
          isInvalid={!String(description).trim()}
          errorBorderColor="crimson"
        />
      </FormControl>

      <Box w="full">
        <FormLabel htmlFor="photo">Картинка</FormLabel>
        {uploadId && uploadPath ? (
          <ImagePreview uploadPath={uploadPath} onClick={onUploadRemove} />
        ) : (
          <Dropzone onFileAccepted={onFileAccepted} />
        )}
      </Box>
    </VStack>
  );
};

export default AddCategoryForm;
