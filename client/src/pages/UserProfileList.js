import React, { useMemo, useState, useEffect } from 'react';
import { useUsers } from '../context/UserProvider';
import UserProfileDetail from './UserProfileDetail';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfileList = () => {
  const { users, handlePatchUser, handleDeleteUser, currentPage } = useUsers();
  const { user } = useAuth();
  const [formSchema, setFormSchema] = useState(null);

  useEffect(() => {
    setFormSchema(
      yup.object().shape({
        username: yup.string().required('Please enter a username'),
        email: yup.string().email().required('Please enter an email'),
        game_master: yup.boolean(),
      })
    );
  }, []);

  const formik = useFormik({
    initialValues: {
      username: user ? user.username : '',
      email: user ? user.email : '',
      game_master: user ? user.game_master : false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handlePatchUser(user.id, values)
        .then(() => {
          toast.success('Profile updated successfully');
        })
        .catch((error) => {
          if (typeof error.message === 'string') {
            toast.error(error.message);
          } else if (typeof error === 'object' && error !== null) {
            for (let field in error) {
              error[field].forEach((message) => {
                toast.error(`${field}: ${message}`);
              });
            }
          }
        });
    },
    enableReinitialize: true,
  });

  const userList = useMemo(() => {
    if (Array.isArray(users)) {
      return users.map((user) => (
        <UserProfileDetail
          key={user.id}
          {...user}
          handlePatchUser={handlePatchUser}
          handleDeleteUser={handleDeleteUser}
        />
      ));
    } else {
      console.error('Users is not an array:', users);
      return null;
    }
  }, [users, handlePatchUser, handleDeleteUser]);

  if (!currentPage) {
    return null;
  }

  return (
    <div>
      {user && users ? (
        <>
          <h1>Profile</h1>
          <form onSubmit={formik.handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <label>Game Master</label>
            <input
              type="checkbox"
              name="game_master"
              checked={formik.values.game_master}
              onChange={formik.handleChange}
            />
            <button type="submit">Update Profile</button>
          </form>
          <ul>{userList}</ul>
        </>
      ) : (
        <h1>You need to log in to view this page!</h1>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserProfileList;