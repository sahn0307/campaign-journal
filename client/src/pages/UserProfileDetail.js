import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UserProfile.scss';

const UserProfileDetail = ({ user, handlePatchUser, handleDeleteUser }) => {
  const [isEditMode, setIsEditMode] = useState(false);
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
      username: user.username || '',
      email: user.email || '',
      game_master: user.game_master || false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handlePatchUser(user.id, values)
        .then(() => {
          toast.success('Profile updated successfully');
          setIsEditMode(false);
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

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (confirmDelete) {
      handleDeleteUser(user.id);
    }
  };

  return (
    <li className="user-profile-detail" key={user.id}>
      {!isEditMode ? (
        <div className="user-info">
          <div className="user-info-item">
            <span className="label">Username: </span>
            <span className="value">{user.username} </span>
          </div>
          <div className="user-info-item">
            <span className="label">Email: </span>
            <span className="value">{user.email} </span>
          </div>
          <div className="user-info-item">
            <span className="label">Game Master: </span>
            <span className="value">{user.game_master ? 'Yes' : 'No'}</span>
          </div>
          <div className="button-group">
            <button className="edit-button" onClick={() => setIsEditMode(true)}>
              Edit
            </button>
            <button className="edit-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : (
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
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditMode(false)}>
            Cancel
          </button>
        </form>
      )}
      <ToastContainer />
    </li>
  );
};

export default UserProfileDetail;