import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

const CharacterDetailForm = ({ character, handlePatchCharacter, handlePostCharacter }) => {
    const [formSchema, setFormSchema] = useState(null)

    const formik = useFormik({
        initialValues: {
            name: character ? character.name : '',
            class_: character ? character.class_ : '',
            race: character ? character.race : '',
            alignment: character ? character.alignment : '',
            age: character ? character.age : 0,
            alive: character ? character.alive : false,
            description: character ? character.description : '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            if (character) {
                handlePatchCharacter(character.id, values)
                .then(() => {
                    toast.success('Character updated successfully')
                })
                .catch(handleError)
            } else {
                handlePostCharacter(values)
                .then(() => {
                    toast.success('Character created successfully')
                })
                .catch(handleError)
            }
        },
        enableReinitialize: true,
    })

    useEffect(() => {
    setFormSchema(
        yup.object().shape({
        name: yup.string().required('Please enter a name').min(2),
        class_: yup.string(),
        race: yup.string(),
        alignment: yup.string(),
        age: yup.number().integer(),
        alive: yup.boolean(),
        description: yup.string(),
        })
    )
    }, [])

    const handleAgeChange = (event) => {
    let inputValue = event.target.value;
    if (inputValue.startsWith('0')) {
        inputValue = inputValue.slice(1);
    }
    formik.setFieldValue('age', inputValue);
}

    useEffect(() => {
        formik.setValues({
            name: character ? character.name : '',
            class_: character ? character.class_ : '',
            race: character ? character.race : '',
            alignment: character ? character.alignment : '',
            age: character ? character.age : 0,
            alive: character ? character.alive : false,
            description: character ? character.description : '',
        })
    }, [character])

    return (
    <Form onSubmit={formik.handleSubmit}>
        {/* Add the new fields here */}
        <label>Name</label>
        <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
        <label>Class</label>
        <input type="text" name="class_" value={formik.values.class_} onChange={formik.handleChange} />
        <label>Race</label>
        <input type="text" name="race" value={formik.values.race} onChange={formik.handleChange} />
        <label>Alignment</label>
        <input type="text" name="alignment" value={formik.values.alignment} onChange={formik.handleChange} />
        <label>Age</label>
        <input type="number" name="age" value={formik.values.age} onChange={handleAgeChange} />
        <label>Alive</label>
        <input type="checkbox" name="alive" checked={formik.values.alive} onChange={formik.handleChange} />
        <label>Description</label>
        <input type="text" name="description" value={formik.values.description} onChange={formik.handleChange} />
        <button type="submit">{character ? 'Update Character' : 'Create Character'}</button>
    </Form>
    )
}

export default CharacterDetailForm

function handleError(error) {
    if (typeof error.message === 'string') {
        toast.error(error.message)
    } else if (typeof error === 'object' && error !== null) {
        for (let field in error) {
            error[field].forEach((message) => {
            toast.error(`${field}: ${message}`)
            })
        }
    }
}

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