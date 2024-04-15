import React, { useMemo, useState, useEffect } from 'react'
import { useUsers } from '../context/UserProvider'
import UserProfileDetail from './UserProfileDetail'
import UserProfileForm from '../components/UserProfileForm'
import { useAuth } from '../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserProfileList = () => {
const { users, handlePatchUser, handleDeleteUser, currentPage } = useUsers()
const { user } = useAuth()

const userList = useMemo(() => {
  if (Array.isArray(users)) {
    return users.map((user) => (
      <UserProfileDetail
      key={user.id}
      {...user}
      handlePatchUser={handlePatchUser}
      handleDeleteUser={handleDeleteUser}
      />
    ))
  } else {
    console.error('Users is not an array:', users)
    return null
  }
}, [users, handlePatchUser, handleDeleteUser])

  if (!currentPage) {
    return null
  }
  
  return (
    <div>
      {user && users ? (
        <>
          <h1>Profile</h1>
          <ul>{userList}</ul>
        </>
      ) : (
        <h1>You need to log in to view this page!</h1>
      )}
      <ToastContainer />
    </div>
  )
}

export default UserProfileList