import React, { createContext } from 'react';
import { AuthState, Action } from '../Types/DataTypes';

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
  token: '',
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export default AuthContext;
