import React from 'react';

const CampaignDetail = ({ id, name, description, isActive, handlePatchCampaign, handleDeleteCampaign }) => {
    return (
        <li key={id}>
            <span>Name: {name}</span>
            <span>Description: {description}</span>
            <span>{`Is Active: ${isActive}`}</span>
            <button onClick={() => handlePatchCampaign(id)}>Update</button>
            <button onClick={() => handleDeleteCampaign(id)}>Delete</button>
        </li>
    );
};

export default CampaignDetail;