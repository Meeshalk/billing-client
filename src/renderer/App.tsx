import React, { useReducer } from 'react';
import AuthContext from './Context/AuthContext';
import { AuthState, Action } from './Types/DataTypes';

import './App.css';
import HomeScreen from './screens/HomeScreen';
import Login from './Login/Login';

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
  token: '',
};

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
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {state.isAuthenticated ? <HomeScreen /> : <Login />}
    </AuthContext.Provider>
  );
}

export default App;
