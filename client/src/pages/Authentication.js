import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from '../context/AuthContext';
import '../styles/Authentication.scss';


function Authentication() {
  const { user, updateUser } = useAuth()
  const location = useLocation();
  const [error, setError] = useState(false);
  const [formSchema, setFormSchema] = useState(null)
  const navigate = useNavigate();
  
  const signUp = location.pathname === '/signup';
  
  useEffect(() => {
    setFormSchema(
      yup.object().shape({
        username: yup.string().required("Please enter a username"),
        password_hash: yup.string().required("Please enter a password"),
        email: signUp ? yup.string().email().required("Please enter an email") : yup.mixed().notRequired(),
        isGameMaster: signUp ? yup.boolean() : yup.mixed().notRequired(),
      })
    );
  }, [signUp]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password_hash: '',
      isGameMaster: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const dataToSend = signUp ? values : { username: values.username, password_hash: values.password_hash };
      fetch(signUp ? '/api/v1/signup' : '/api/v1/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then(res => {
          if (res.ok) {
            res.json().then(user => {
              console.log(user);
              updateUser(user);
              navigate('/');
            });
          } else {
            res.json().then(error => setError(error.message));
          }
        });
    },
  });

    if (user) {
    return <h2>You are already signed in!</h2>;
  }

  return (
    <div className="authentication">
      {formik.errors.username && <h2 className="error">{formik.errors.username}</h2>}
      {formik.errors.email && <h2 className="error">{formik.errors.email}</h2>}
      {formik.errors.password_hash && <h2 className="error">{formik.errors.password_hash}</h2>}
      {error && <h2 className="error">{error}</h2>}
      <form className="authentication-form" onSubmit={formik.handleSubmit}>
        <label>Username</label>
        <input type='text' name='username' value={formik.values.username} onChange={formik.handleChange} />
        <label>Password</label>
        <input type='password' name='password_hash' value={formik.values.password_hash} onChange={formik.handleChange} />
        {signUp && (
          <>
            <label>Email</label>
            <input type='text' name='email' value={formik.values.email} onChange={formik.handleChange} />
            <label>Would you like to be a game master?</label>
            <input type='checkbox' name='isGameMaster' checked={formik.values.isGameMaster} onChange={formik.handleChange} />
          </>
        )}
        <input type='submit' value={signUp ? 'Sign Up!' : 'Log In!'} />
      </form>
    </div>
  );
}

export default Authentication;

//export const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   width: 400px;
//   margin: auto;
//   font-family: Arial;
//   font-size: 30px;

//   input[type=submit] {
//     background-color: #42ddf5;
//     color: white;
//     height: 40px;
//     font-family: Arial;
//     font-size: 30px;
//     margin-top: 10px;
//     margin-bottom: 10px;
//   }
// `;