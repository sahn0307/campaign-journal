import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const CharactersContext = createContext();

export const useCharacters = () => useContext(CharactersContext);

const CharacterProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [characters, setCharacters] = useState([]);
    const { deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'characters') {
            (async () => {
                try {
                    const res = await fetch(`/api/v1/${currentPage}`);
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setCharacters(data);
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

    const handlePatchCharacter = async (id, updates) => {
        setCharacters(characters.map(character => character.id === id ? { ...character, ...updates } : character));
        try {
            const result = await patchJSON(`/api/v1/${currentPage}/${id}`, updates);
            if (!result.ok) {
                throw new Error('Patch failed: status: ' + result.status);
            }
        } catch (err) {
            console.log(err);
            setCharacters(currentCharacters => currentCharacters.map(character =>
                character.id === id ? { ...character, ...revertUpdates(character, updates) } : character
            ));
        }

        function revertUpdates(character, updates) {
            const revertedUpdates = {};
            for (let key in updates) {
                revertedUpdates[key] = character[key];
            }
            return revertedUpdates;
        }
    };

    const handleDeleteCharacter = async (id) => {
        const characterToDelete = characters.find(character => character.id === id);
        setCharacters(characters.filter(character => character.id !== id));
        try {
            const resp = await deleteJSON(`/api/v1/${currentPage}/${id}`);
            if (resp.status === 204) {
                console.log('Character deleted successfully');
            }
        } catch (err) {
            console.log(err);
            setCharacters(currentCharacters => [...currentCharacters, characterToDelete]);
        }
    };

    const handlePostCharacter = async (newCampaign) => {
        try {
            const resp = await postJSON(`/api/v1/${currentPage}`, newCampaign);
            if (resp.status === 201) {
                const campaign = await resp.json();
                setCharacters(prevCampaigns => [...prevCampaigns, campaign]);
                console.log('Campaign created successfully');
            } else {
                throw new Error('Post failed: status: ' + resp.status);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <CharactersContext.Provider value={{ characters, handlePatchCharacter, handleDeleteCharacter,handlePostCharacter, currentPage }}>
            {children}
        </CharactersContext.Provider>
    );
};

export default CharacterProvider;