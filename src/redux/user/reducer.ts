import { User } from '@interfaces/user';
import { createReducer } from '@reduxjs/toolkit';
import { setUser, resetUser } from '@redux/user/action';

const initialState: User | null = null;

const userReducer = createReducer<User | null>(initialState, builder =>
  builder
    .addCase(setUser, (state, action) => {
      state = action.payload;
      return state;
    })
    .addCase(resetUser, (state, _) => {
      state = initialState;
      return state;
    })
);

export default userReducer;
