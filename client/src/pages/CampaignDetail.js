import React, { useState } from 'react'
import CampaignDetailForm from '../components/CampaignDetailForm'


const CampaignDetail = ({ id, name, description, characters , handleDeleteCampaign}) => {
    const [showForm, setShowForm] = useState(false)
    const [isCreating, setIsCreating] = useState(false)


    const campaign = { id, name, description, characters }
    const startUpdate = () => {
        setShowForm(true);
        setIsCreating(false);
    }

    const startCreate = () => {
        setShowForm(true);
        setIsCreating(true);
    }

    return (
        <li>
            <span>Name: {name}</span>
            <span>Description: {description}</span>
            <span>Active Characters in the campaign: 
                {characters.map(characterCampaign => characterCampaign.character).join(', ')}
            </span>
            <button onClick={startUpdate}>Update</button>
            <button onClick={() => handleDeleteCampaign(id)}>Delete</button>
            <button onClick={startCreate}>Create New Campaign</button>
            {showForm && <CampaignDetailForm campaign={isCreating ? null : campaign}/>}
        </li>
    )
}

export default CampaignDetail