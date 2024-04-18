import React, {  useState } from 'react';
import { useCampaigns } from '../context/CampaignProvider';
import CampaignDetail from './CampaignDetail';
// import { useAuth } from '../context/AuthContext';
import CampaignDetailForm from '../components/CampaignDetailForm';
import '../styles/CampaignList.scss';

const CampaignList = () => {
  const { campaigns, handleDeleteCampaign, handlePostCampaign, handlePatchCampaign } = useCampaigns()
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
// console.log(`campaigns: ${JSON.stringify(campaigns, null, 2)}`)
// console.log(`allchars: ${JSON.stringify(allCharacters, null, 2)}`)

  const startCreate = () => {
    setIsCreating(true);
    setSelectedCampaign(null);
  };

  const startUpdate = (campaign) => {
    setIsCreating(false);
    setSelectedCampaign(campaign);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedCampaign(null);
  };

  return (
    <div>
      <h1>Campaigns</h1>
      {!selectedCampaign ? (
        <button onClick={startCreate}>Create New Campaign</button>
      ) : (
        <button onClick={handleCancel}>Cancel</button>
      )}
      { (selectedCampaign || isCreating) && (
        <CampaignDetailForm
          campaign={selectedCampaign || {}}
          handleCancel={handleCancel}
          handlePostCampaign={handlePostCampaign}
          handlePatchCampaign={handlePatchCampaign}
        />
      )}
      {!selectedCampaign && campaigns.map((campaign) => (
        <CampaignDetail
          key={campaign.id}
          campaign={campaign}
          startUpdate={startUpdate}
          handleDeleteCampaign={handleDeleteCampaign}
        />
      ))}
    </div>
  );
};

export default CampaignList;