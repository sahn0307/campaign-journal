import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UserProfile.scss';
import { useNavigate } from 'react-router-dom';

const UserProfileDetail = ({ user, handlePatchUser, handleDeleteUser }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().required('Please enter a username'),
    email: yup.string().email().required('Please enter an email'),
    game_master: yup.boolean(),
    current_password: yup.string().required('Please enter your current password'),
    new_password: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      username: user.username || '',
      email: user.email || '',
      game_master: user.game_master || false,
      current_password: '',
      new_password: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (showChangePassword && !values.new_password) {
        toast.error('Please enter a new password');
        return;
  }
      const payload = {
        username: values.username,
        email: values.email,
        game_master: values.game_master,
        current_password: values.current_password,
      };

      if (showChangePassword) {
        payload.password_hash = values.new_password;
      }

      handlePatchUser(user.id, payload)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Update failed');
          }
          toast.success(showChangePassword ? 'Password updated successfully' : 'Profile updated successfully');
          setIsEditMode(false);
          setShowChangePassword(false);
          formik.resetForm({
          values: {
            ...formik.values,
            current_password: '',
            new_password: '',
            },
          });
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
                formik.resetForm({
        values: {
          ...formik.values,
          current_password: '',
          new_password: '',
        },
      });
        });
    },
    enableReinitialize: true,
  });

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (confirmDelete) {
      handleDeleteUser(user.id);
      navigate('/login');
    }
  };

  return (
    <div className="user-profile" key={user.id}>
      {!isEditMode ? (
        <div className="profile-info">
         <h1>
            Profile
         </h1>
          <p>
            <span className="label">Username: </span>
            <span className="value">{user.username}</span>
          </p>
          <p>
            <span className="label">Email: </span>
            <span className="value">{user.email}</span>
          </p>
          <p>
            <span className="label">Game Master: </span>
            <span className="value">{user.game_master ? 'Yes' : 'No'}</span>
          </p>
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
            {!showChangePassword && (
              <>
                <label>Username</label>
                <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} autoComplete="username"/>
                <label>Email</label>
                <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} autoComplete="email"/>
                <label>Game Master</label>
                <input type="checkbox" name="game_master" checked={formik.values.game_master} onChange={formik.handleChange} />
              </>
        )}
        {showChangePassword && (
          <>
            <label>New Password</label>
            <input type="password" placeholder="Enter New Password" name="new_password" value={formik.values.new_password} onChange={formik.handleChange} autoComplete="new-password"/>
          </>
        )}
        <label>Current Password</label>
        <input type="password" placeholder="Current Password Required" name="current_password" value={formik.values.current_password} onChange={formik.handleChange} autoComplete="current-password" />
        <button type="submit">Save</button>
            {showChangePassword ? null : <button type="button" onClick={() => setIsEditMode(false)}> Cancel
            </button>}
          <button type="button" onClick={() => setShowChangePassword(!showChangePassword)}>
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserProfileDetail;