import React, { useState } from 'react'
import UserProfileForm from '../components/UserProfileForm';


const UserProfileDetail = ({ id, username, email, game_master, handlePatchUser, handleDeleteUser }) => {
    const [isEditing, setIsEditing] = useState(false);

    const user = { id, username, email, game_master };

    return (
        <li key={id}>
            <span>Username: {username}</span>
            <span>Email: {email}</span>
            <span>{`game_master: ${game_master}`}</span>
            <button onClick={() => handleDeleteUser(id)}>Delete</button>
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Update Profile'}
            </button>
            {isEditing && <UserProfileForm user={user} handlePatchUser={handlePatchUser} />}
        </li>
    )
}

export default UserProfileDetail