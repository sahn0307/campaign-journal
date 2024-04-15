import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import { useCampaigns } from '../context/CampaignProvider'


const CampaignDetailForm = ({ campaign }) => {
    const { handlePatchCampaign, handlePostCampaign } = useCampaigns();
    const [formSchema, setFormSchema] = useState(null)

    useEffect(() => {
    setFormSchema(
        yup.object().shape({
        name: yup.string().required('Please enter a name'),
        description: yup.string().required('Please enter a description'),
        })
    )
    }, [])

    const formik = useFormik({
    initialValues: {
        name: campaign ? campaign.name : '',
        description: campaign ? campaign.description : '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
        if (campaign) {
            handlePatchCampaign(campaign.id, values)
            .then(() => {
                toast.success('Campaign updated successfully')
            })
            .catch(handleError)
        } else {
            handlePostCampaign(values)
            .then(() => {
                toast.success('Campaign created successfully')
            })
            .catch(handleError)
        }
    },
    enableReinitialize: true,
    })

    return (
    <Form onSubmit={formik.handleSubmit}>
        <label>Name</label>
        <input
        type="text"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        />
        <label>Description</label>
        <input
        type="text"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        />
        <button type="submit">{campaign ? 'Update Campaign' : 'Create Campaign'}</button>
    </Form>
    )
}

export default CampaignDetailForm

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