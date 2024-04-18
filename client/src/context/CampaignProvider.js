import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CampaignsContext = createContext();

export const useCampaigns = () => useContext(CampaignsContext);

const CampaignProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [allCharacters, setAllCharacters] = useState([])
    const { deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'campaigns') {
            (async () => {
                try {
                    const res = await fetch(`/api/v1/${currentPage}`);
                    if (res.ok) {
                        const data = await res.json();
                        setCampaigns(data.data);
                        // console.log('Campaigns:');
                        // data.data.map((campaign, index) => {
                        // console.log(`Campaign ${index}:`, campaign);
                        // });
                        setAllCharacters(data.characters)
                        // console.log('allCharOnFetch:');
                        // data.characters.map((character, index) => {
                        // console.log(`Character ${index}:`, character);
                        // });
                        toast.success('Data fetched successfully');
                    } else {
                        toast.error('Failed to fetch data');
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching data');
                }
            })();
        }
    }, [currentPage, updateUser, logout]);


    const handlePatchCampaign = async (payload) => {
        setCampaigns(campaigns.map(campaign => campaign.id === payload.id ? { ...campaign, ...payload } : campaign));
        const serverPayload = {
            ...payload,
            characters: payload.characters.map(({ name, ...rest }) => rest),
        };

        try {
            await patchJSON(`/api/v1/${currentPage}/${payload.id}`, serverPayload);
            debugger
            toast.success('Campaign updated successfully');
        } catch (err) {
                toast.error('An error occurred while updating the campaign');            setCampaigns(currentCampaigns => currentCampaigns.map(campaign =>
                campaign.id === payload.id ? { ...campaign, ...revertUpdates(campaign, payload) } : campaign
            ));
        }
    }

    function revertUpdates(campaign, payload) {
        const revertedUpdates = {};
        for (let key in payload) {
            revertedUpdates[key] = campaign[key];
        }
        return revertedUpdates;
    };

    const handleDeleteCampaign = async (id) => {
        const campaignToDelete = campaigns.find(campaign => campaign.id === id);
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        try {
            const resp = await deleteJSON(`/api/v1/${currentPage}/${id}`);
            if (resp.status === 204) {
                toast.success('Campaign deleted successfully');
            }
        } catch (err) {
            toast.error('An error occurred while deleting the campaign');
            setCampaigns(currentCampaigns => [...currentCampaigns, campaignToDelete]);
        }
    };

    const handlePostCampaign = async (newCampaign) => {
        debugger
        try {
            const resp = await postJSON(`/api/v1/${currentPage}`, newCampaign);
            if (resp.status === 201) {
                const campaign = await resp.json();
                setCampaigns(prevCampaigns => [...prevCampaigns, campaign]);
                toast.success('Campaign created successfully');
            } else {
                throw new Error('Post failed: status: ' + resp.status);
            }
        } catch (err) {
            toast.error('An error occurred while creating the campaign');
        }
    };

    return (
        <CampaignsContext.Provider value={{ allCharacters, campaigns, handlePatchCampaign, handleDeleteCampaign, handlePostCampaign, currentPage }}>
            {children}
        </CampaignsContext.Provider>
    );
};

export default CampaignProvider;