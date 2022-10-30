import React, { useReducer } from 'react';
import AuthContext from './Context/AuthContext';
import { AuthState, Action, User } from './Types/DataTypes';

import './App.css';
import Login from './Login/Login';
import Home from './Home/Home';

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
  token: '',
};

function hasValidUser(user: User) {
  return (
    user.id.length === 36 && user.email !== null && user.username.length > 3
  );
}

function hasValidToken(token: string) {
  return token.length > 20;
}

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'login':
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'logout':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = JSON.parse(localStorage.getItem('user')) as User;
  const token = JSON.parse(localStorage.getItem('token')) as string;

  if (
    user !== null &&
    token !== null &&
    hasValidUser(user) &&
    hasValidToken(token) &&
    state.isAuthenticated === false
  ) {
    dispatch({
      type: 'login',
      payload: {
        user,
        token,
      },
    });
  }
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {state.isAuthenticated ? <Home /> : <Login />}
    </AuthContext.Provider>
  );
}

export default App;
