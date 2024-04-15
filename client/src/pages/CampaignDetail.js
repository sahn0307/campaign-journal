import React from 'react'


const CampaignDetail = ({ id, name, description, characters , handleDeleteCampaign, startUpdate}) => {



    // const campaign = { id, name, description, characters }


    return (
        <li>
            <span>Name: {name}</span>
            <span>Description: {description}</span>
            <span>Active Characters in the campaign: 
                {characters.map(characterCampaign => characterCampaign.character).join(', ')}
            </span>
            <button onClick={startUpdate}>Update</button>
            <button onClick={() => handleDeleteCampaign(id)}>Delete</button>           
        </li>
    )
}

export default CampaignDetail