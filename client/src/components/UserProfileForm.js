import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

const UserProfileForm = ({ user, handlePatchUser }) => {
    const [formSchema, setFormSchema] = useState(null)

    useEffect(() => {
    setFormSchema(
        yup.object().shape({
        username: yup.string().required('Please enter a username'),
        email: yup.string().email().required('Please enter an email'),
        game_master: yup.boolean(),
        })
    )
    }, [])

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
            toast.success('Profile updated successfully')
        })
        .catch((error) => {
            if (typeof error.message === 'string') {
            toast.error(error.message)
            } else if (typeof error === 'object' && error !== null) {
            for (let field in error) {
                error[field].forEach((message) => {
                toast.error(`${field}: ${message}`)
                })
            }
            }
        })
    },
    enableReinitialize: true,
    })

    return (
    <Form onSubmit={formik.handleSubmit}>
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
    </Form>
    )
    }

export default UserProfileForm
    
const Form = styled.form`
    display:flex
    flex-direction:column
    width: 400px
    margin:auto
    font-family:Arial
    font-size:30px
    input[type=submit]{
      background-color:#42ddf5
      color: white
      height:40px
      font-family:Arial
      font-size:30px
      margin-top:10px
      margin-bottom:10px
    }
  `