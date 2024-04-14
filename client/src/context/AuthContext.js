import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
  };

  const logout = () => {
    fetch("/api/v1/logout", {method: "DELETE"})
      .then(resp => {
        if (resp.status === 204) {
          updateUser(null)
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <AuthContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}