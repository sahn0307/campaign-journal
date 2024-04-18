import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CharacterDetail.scss';

const CharacterDetail = ({ id, name, class_, race, alignment, age, alive, description, campaigns, handleDeleteCharacter, handlePatchCharacter }) => {
  const [formSchema, setFormSchema] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: name || '',
      class_: class_ || '',
      race: race || '',
      alignment: alignment || '',
      age: age || 0,
      alive: alive || false,
      description: description || '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const confirmUpdate = window.confirm('Are you sure you want to update this character?');
      if (confirmUpdate) {
        handlePatchCharacter(id, values)
          .then(() => {
            toast.success('Character updated successfully');
            setIsEditMode(false);
          })
          .catch(handleError);
      }
    },
    enableReinitialize: true,
  });

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
    );
  }, []);

  const handleAgeChange = (event) => {
    let inputValue = event.target.value;
    if (inputValue.startsWith('0')) {
      inputValue = inputValue.slice(1);
    }
    formik.setFieldValue('age', inputValue);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this character?');
    if (confirmDelete) {
      handleDeleteCharacter(id);
    }
  };

  return (
    <div className="character-detail-wrapper">
      {!isEditMode ? (
        <div className="character-info">
          <div className="character-info-item">
            <span className="label">Name:</span>
            <span className="value">{name}</span>
          </div>
          <div className="character-info-item">
            <span className="label">Class:</span>
            <span className="value">{class_}</span>
          </div>
          <div className="character-info-item">
            <span className="label">Race:</span>
            <span className="value">{race}</span>
          </div>
          <div className="character-info-item">
            <span className="label">Alignment:</span>
            <span className="value">{alignment}</span>
          </div>
          <div className="character-info-item">
            <span className="label">Age:</span>
            <span className="value">{age}</span>
          </div>
          <div className="character-info-item">
            <span className="label">Is Alive:</span>
            <span className="value">{alive ? 'Yes' : 'No'}</span>
          </div>
          <div className="character-info-item">
            <span className="label">Description:</span>
            <span className="value">{description}</span>
          </div>
          <div>
          <span>Campaigns: {campaigns && campaigns.map(campaign => <span key={campaign.gamemaster_id}>{campaign.name}</span>)}</span>
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
          <div className="button-group">
            <button type="submit">Update Character</button>
            <button type="button" onClick={() => setIsEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CharacterDetail;

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