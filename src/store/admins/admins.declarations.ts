import { Id, User } from '@app/declarations';

export interface AdminsState {
  total: number;
  data: User[];
  loading: 'idle' | 'pending';
  error?: string;

  writeData: Partial<User>;

  createLoading: 'idle' | 'pending';
  createError?: string;
  createSuccess: boolean;

  deleteLoading: 'idle' | 'pending';
  deleteError?: string;
  deleteSuccess: boolean;

  page: number;
}

export type FetchAdminsParams = {
  page: number;
  accessToken: string;
};

export type CreateAdminParams = {
  data: {
    email?: string;
    password?: string;
  };
  accessToken?: string;
};

export type DeleteAdminParams = {
  adminId: Id;
  accessToken: string;
};
