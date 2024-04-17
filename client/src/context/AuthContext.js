import React, { createContext, useState, useContext, useEffect} from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const updateUser = (user) => {
    setUser(user)
  }

    useEffect(() => {
        fetch('api/v1/check_session')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Unauthorized');
                }
            })
            .then(data => {
                updateUser(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}