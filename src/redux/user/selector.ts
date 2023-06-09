import { User } from '@interfaces/user';
import { RootState } from '@redux';

export const getUserSelector = (state: RootState): User | null => state.user;
