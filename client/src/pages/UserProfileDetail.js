import React, { useEffect } from 'react'

const UserProfileDetail = ({ id, username, email, game_master, handlePatchUser, handleDeleteUser }) => {
    // if (!user) {
    //     return null
    // }

    return (
        <li key={id}>
        <span>Username: {username}</span>
        <span>Email: {email}</span>
        <span>{`game_master: ${game_master}`}</span>
            <button onClick={() => handleDeleteUser(id)}>Delete</button>
        </li>
    )
}

export default UserProfileDetail