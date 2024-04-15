import React, { useMemo } from 'react';
import { useCampaigns } from '../context/CampaignProvider';
import CampaignDetail from './CampaignDetail';
import { useAuth } from '../context/AuthContext';

const CampaignList = () => {
    const { campaigns, handlePatchCampaign, handleDeleteCampaign, currentPage } = useCampaigns();
    const { user } = useAuth();
    console.log('Current page:', currentPage);
    console.log(campaigns)

    const campaignList = useMemo(() => {
        if (Array.isArray(campaigns)) {
          return campaigns.map(campaign => (
              <CampaignDetail 
                  key={campaign.id} 
                  {...campaign}
                  handlePatchCampaign={handlePatchCampaign} 
                  handleDeleteCampaign={handleDeleteCampaign} 
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
        <div>
            {(user && campaigns) ? (
                <>
                    <h1>Campaigns</h1>
                    <ul>
                        {campaignList}
                    </ul>
                </>
            ) : (
                <h1>You need to log in to view this page!</h1>
            )}
        </div>
    );
};

export default CampaignList;