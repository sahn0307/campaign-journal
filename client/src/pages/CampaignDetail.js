
import React from 'react';

const CampaignDetail = ({ campaign, startUpdate, handleDeleteCampaign }) => {
  return (
    <div>
      <h2>{campaign.name}</h2>
      <p>{campaign.description}</p>
      <p>Log: {campaign.log}</p>
      <div>
        <h3>Assigned Characters:</h3>
        {campaign.characters && campaign.characters.map(character => (
          <div key={character.id}>
            <h4>{character.name}</h4>
          </div>
        ))}
      </div>
      <button onClick={() => startUpdate(campaign)}>Edit</button>
      <button onClick={() => handleDeleteCampaign(campaign.id)}>Delete</button>
    </div>
  );
};

export default CampaignDetail;
