import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import '../styles/CampaignDetail.scss';


const CampaignDetail = ({ id, name, description, characters, handleDeleteCampaign, handlePatchCampaign }) => {
  const [formSchema, setFormSchema] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const charactersList = characters.map(character => character.name).join(', ')

  useEffect(() => {
    setFormSchema(
      yup.object().shape({
        name: yup.string().required('Please enter a name'),
        description: yup.string().required('Please enter a description'),
        // characters: yup.array().of(yup.string()),
        characters: yup.string()
      })
    );
  }, []);

  const formik = useFormik({
    initialValues: {
      name: name,
      description: description,
      charactersList: characters.map(character => character.name).join(', '),
      characters: characters,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const confirmUpdate = window.confirm('Are you sure you want to update this campaign?');
      if (confirmUpdate) {
        handlePatchCampaign(id, values)
          .then(() => {
            toast.success('Campaign updated successfully');
            setIsEditMode(false);
          })
          .catch(handleError);
      }
    },
    enableReinitialize: true,
  });

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
    if (confirmDelete) {
      handleDeleteCampaign(id);
    }
  };

  return (
    <div className="campaign-detail-wrapper">
      {!isEditMode ? (
        <div className="campaign-info">
          <div className="campaign-info-item">
            <span className="label">Name:</span>
            <span className="value">{name}</span>
          </div>
          <div className="campaign-info-item">
            <span className="label">Description:</span>
            <span className="value">{description}</span>
          </div> 
          <div className="campaign-info-item">
            <span className="label">Active Characters:</span>
            <span className="value">{characters.map(character => <span key={character.id}>{character.name}</span>)}</span>
          </div>
          <div className="button-group">
            <button className="update-button" onClick={() => setIsEditMode(true)}>
              Update
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          <label>Add Character to Campaign:</label>
          <input
            type="text"
            name="characters"
            value={formik.values.characters}
            onChange={formik.handleChange}
          />
          <label>Active Characters:</label>
          <input
            type="text"
            name="characterslist"
            value={formik.values.charactersList}
            readOnly>

            </input>
          <div className="button-group">
            <button type="submit">Update Campaign</button>
            <button type="button" onClick={() => setIsEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CampaignDetail;

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: auto;
  font-family: Arial;
  font-size: 30px;
  input[type=submit] {
    background-color: #42ddf5;
    color: white;
    height: 40px;
    font-family: Arial;
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;