import React from 'react';
import { useUsers } from '../context/UserProvider';
import UserProfileDetail from './UserProfileDetail';
import { useAuth } from '../context/AuthContext';
import '../styles/UserProfile.scss';

const UserProfileList = () => {
    const { users, handlePatchUser, handleDeleteUser, currentPage } = useUsers();
    const { user } = useAuth();
    
    if (!currentPage) {
      return null;
    }
  
    return (
      <div className="user-profile-container">
        
          {user && users ? (
            <>
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
            <h1>You need to log in to view this page! </h1>
          )}

      </div>
    );
  };
  
  export default UserProfileList;