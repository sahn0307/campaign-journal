import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const CampaignsContext = createContext();

export const useCampaigns = () => useContext(CampaignsContext);

const CampaignProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const { deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'campaigns') {
            (async () => {
                try {
                    const res = await fetch(`/api/v1/${currentPage}`);
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setCampaigns(data);
                        console.log('Data from API:', data);
                    } else {
                        console.error('Data is not an array:', data);
                    }
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [currentPage]);

    const handlePatchCampaign = async (id, updates) => {
        setCampaigns(campaigns.map(campaign => campaign.id === id ? { ...campaign, ...updates } : campaign));
        try {
            const result = await patchJSON(`/api/v1/${currentPage}`, id, updates);
            if (!result.ok) {
                throw new Error('Patch failed: status: ' + result.status);
            }
        } catch (err) {
            console.log(err);
            setCampaigns(currentCampaigns => currentCampaigns.map(campaign =>
                campaign.id === id ? { ...campaign, ...revertUpdates(campaign, updates) } : campaign
            ));
        }

        function revertUpdates(campaign, updates) {
            const revertedUpdates = {};
            for (let key in updates) {
                revertedUpdates[key] = campaign[key];
            }
            return revertedUpdates;
        }
    };

    const handleDeleteCampaign = async (id) => {
        const campaignToDelete = campaigns.find(campaign => campaign.id === id);
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        try {
            const resp = await deleteJSON(`/api/v1/${currentPage}/${id}`);
            if (resp.status === 204) {
                console.log('Campaign deleted successfully');
            }
        } catch (err) {
            console.log(err);
            setCampaigns(currentCampaigns => [...currentCampaigns, campaignToDelete]);
        }
    };

    return (
        <CampaignsContext.Provider value={{ campaigns, handlePatchCampaign, handleDeleteCampaign, currentPage }}>
            {children}
        </CampaignsContext.Provider>
    );
};

export default CampaignProvider;