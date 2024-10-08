import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_TOKENS':
      return { ...state, user: { ...state.user, tokens: action.payload } }
    case 'UPDATE_DAILY_TOKENS':
      return { ...state, user: { ...state.user, daily_tokens: action.payload } }
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};


export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, { user: null });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
