import React, { useState, useEffect, createContext, useContext } from 'react'
import { useFetchJSON } from '../utils/helpers'
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const UsersContext = createContext()

export const useUsers = () => useContext(UsersContext)

const UserProvider = ({ children }) => {
    const { updateUser, logout } = useAuth()
    const [users, setUsers] = useState([])
    const { deleteJSON, patchJSON } = useFetchJSON()
    const location = useLocation()
    const currentPage = location.pathname.slice(1)
    
    useEffect(() => {
        if (currentPage === 'profile') {
            (async () => {
                try {
                    const res = await fetch(`/api/v1/${currentPage}`)
                    const data = await res.json()
                    if (Array.isArray(data)) { // ensure data is an array
                        setUsers(data)
                        console.log('Data from API:', data);
                    } else {
                        console.error('Data is not an array:', data)
                    }
                } catch (err) {
                    console.log(err)
                }
            })()
        }
    }, [currentPage])

    const handlePatchUser = async (id, updates) => {
        setUsers(users.map(user => user.id === id ? { ...user, ...updates } : user))
        try {
            // await patchJSON(`/api/v1/${currentPage}`, id, updates)
            const result = await patchJSON(`/api/v1/${currentPage}`, id, updates)
            if (!result.ok) {
                throw new Error('Patch failed: status: ' + result.status)
            }
        } catch (err) {
            console.log(err)
            // setTimeout(() => includeErrorAlerts(''), 5000)
            setUsers(currentUsers => currentUsers.map(user =>
                user.id === id ? { ...user, ...revertUpdates(user, updates) } : user
            ))
        }

        function revertUpdates(user, updates) {
            const revertedUpdates = {}
            for (let key in updates) {
                revertedUpdates[key] = user[key]
            }
            return revertedUpdates
        }
    }
    const handleDeleteUser = async (id) => {
        const userToDelete = users.find(user => user.id === id)
        setUsers(users.filter(user => user.id !== id))
        try {
            const resp = await deleteJSON(`/api/v1/${currentPage}/${id}`)
            if (resp.status === 204) {
                console.log('User deleted successfully')
                logout();
            }
        } catch (err) {
            console.log(err)
            setUsers(currentUsers => [...currentUsers, userToDelete])
        }
    }

    return (
        <UsersContext.Provider value={{ users, handlePatchUser, handleDeleteUser, currentPage }}> 
            {children}
        </UsersContext.Provider>
    )
}

export default UserProvider;