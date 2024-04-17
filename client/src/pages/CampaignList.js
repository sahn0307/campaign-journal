import React, { useMemo, useState } from 'react';
import { useCampaigns } from '../context/CampaignProvider';
import CampaignDetail from './CampaignDetail';
import { useAuth } from '../context/AuthContext';
import CampaignDetailForm from '../components/CampaignDetailForm';
import '../styles/CampaignList.scss';

const CampaignList = () => {
  const { campaigns, handlePatchCampaign, handleDeleteCampaign, handlePostCampaign, currentPage } = useCampaigns();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const startCreate = () => {
    setShowForm(true);
    setIsCreating(true);
    setSelectedCampaign(null);
  };

  const startUpdate = (campaign) => {
    setShowForm(true);
    setIsCreating(false);
    setSelectedCampaign(campaign);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsCreating(false);
    setSelectedCampaign(null);
  };

  const campaignList = useMemo(() => {
    if (Array.isArray(campaigns)) {
      return campaigns.map((campaign) => (
        <CampaignDetail
          key={campaign.id}
          {...campaign}
          handlePatchCampaign={handlePatchCampaign}
          handleDeleteCampaign={handleDeleteCampaign}
          startUpdate={() => startUpdate(campaign)}
        />
      ));
    } else {
      console.error('Campaigns is not an array:', campaigns);
      return null;
    }
  }, [campaigns, handlePatchCampaign, handleDeleteCampaign]);

  if (!currentPage) {
    return null;
  }

  return (
    <div className="campaign-list">
      {user && campaigns ? (
        <>
          <h1>Campaigns</h1>
          {!showForm ? (
            <button onClick={startCreate}>Create New Campaign</button>
          ) : (
            <button onClick={handleCancel}>Cancel</button>
          )}
          {showForm && (
            <div className="form-container">
              <CampaignDetailForm
                campaign={isCreating ? null : selectedCampaign}
                onCancel={handleCancel}
                handlePostCampaign={handlePostCampaign}
                handlePatchCampaign={handlePatchCampaign}
                handleCancel={handleCancel}
              />
            </div>
          )}
          <ul>{campaignList}</ul>
        </>
      ) : (
        <h1>You need to log in to view this page!</h1>
      )}
    </div>
  );
};

export default CampaignList;