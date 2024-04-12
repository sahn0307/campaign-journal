// import React, { useState, useEffect } from 'react'
// import { v4 as uuidv4 } from 'uuid'
// import useFetchJSON from '../utils/helpers'
// // import { useErrorAlerts } from './ErrorAlertsProvider'

// export const  = React.createContext()
// // export const url = 'http://localhost:4000/records'

// const AuthProvider = ({ children }) => {

//     const { postJSON, patchJSON } = useFetchJSON()

//     const [user, setUser] = useState(null)

//     return (
//         <UserContext.Provider>
//             {children}
//         </UserContext.Provider>
//     )
// }



// export default AuthProvider

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};