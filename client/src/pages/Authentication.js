import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from '../context/AuthContext';
import '../styles/Authentication.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Authentication() {
  const { user, updateUser } = useAuth()
  const location = useLocation();
  const [prevErrors, setPrevErrors] = useState('');
  const [formSchema, setFormSchema] = useState(null)
  const navigate = useNavigate();
  
  const signUp = location.pathname === '/signup';
  
  useEffect(() => {
    setFormSchema(
      yup.object().shape({
        username: yup.string().required("Please enter a username"),
        password_hash: yup.string().required("Please enter a password"),
        email: signUp ? yup.string().email().required("Please enter an email") : yup.mixed().notRequired(),
        game_master: signUp ? yup.boolean() : yup.mixed().notRequired(),
      })
    );
  }, [signUp]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password_hash: '',
      game_master: false,
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
              res.json().then(error => {
                // Check if the error message is a string
                if (typeof error.message === 'string') {
                  // The server is returning a single error message
                  toast.error(error.message);
                } else if (typeof error === 'object' && error !== null) {
                  // The server is returning an object with the error messages
                  for (let field in error) {
                    error[field].forEach(message => {
                      toast.error(`${field}: ${message}`);
                    });
                  }
                }
              });
          }
        });
    },
    enableReinitialize: true,
  })
  
useEffect(() => {
  const currentErrors = JSON.stringify(formik.errors);
  if (currentErrors !== prevErrors) {
    Object.values(formik.errors).forEach(error => {
      toast.error(error);
    });
    setPrevErrors(currentErrors);
  }
}, [formik.errors, prevErrors]);

    if (user) {
    return <h2>You are already signed in!</h2>;
  }

  return (
  <div className="authentication">
    <ToastContainer />
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
          <input type='checkbox' name='game_master' checked={formik.values.game_master} onChange={formik.handleChange} />
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