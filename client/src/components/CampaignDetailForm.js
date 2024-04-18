import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CharacterDetailForm.scss'; // Import the SCSS file
import { useCampaigns } from '../context/CampaignProvider';

const CampaignDetailForm = ({ campaign, handleCancel }) => {
  const { handlePatchCampaign, handlePostCampaign } = useCampaigns();
  const [formSchema, setFormSchema] = useState(null);

  useEffect(() => {
    setFormSchema(
      yup.object().shape({
        name: yup.string().required('Please enter a name'),
        description: yup.string().required('Please enter a description'),
      })
    );
  }, []);

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
            toast.success('Campaign updated successfully');
            handleCancel();
          })
          .catch(handleError);
      } else {
        handlePostCampaign(values)
          .then(() => {
            debugger
            toast.success('Campaign created successfully');
            handleCancel();
            debugger
          })
          .catch(handleError);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div className="character-detail-wrapper">
      <form onSubmit={formik.handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
        <label>Description</label>
        <input type="text" name="description" value={formik.values.description} onChange={formik.handleChange} />
        <button type="submit">{campaign ? 'Update Campaign' : 'Create Campaign'}</button>
      </form>
    </div>
  );
};

export default CampaignDetailForm;

function handleError(error) {
  if (typeof error.message === 'string') {
    toast.error(error.message);
  } else if (typeof error === 'object' && error !== null) {
    for (let field in error) {
      error[field].forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    }
  }
}