import React from 'react';
import { useUsers } from '../context/UserProvider';
import UserProfileDetail from './UserProfileDetail';
import '../styles/UserProfile.scss';

const UserProfileList = () => {
    const { users, handlePatchUser, handleDeleteUser, currentPage } = useUsers();
  
    if (!currentPage) {
      return null;
    }
  
    return (
      <div className="user-profile-container">
        <div className="user-profile">
          {users ? (
            <>
              <h1>Profiles</h1>
              <div>
                {users.map((user) => (
                  <UserProfileDetail
                    key={user.id}
                    user={user}
                    handlePatchUser={handlePatchUser}
                    handleDeleteUser={handleDeleteUser}
                  />
                ))}
              </div>
            </>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      </div>
    );
  };
  
  export default UserProfileList;