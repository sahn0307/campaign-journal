import React, { useMemo, useState } from 'react';
import { useCharacters } from '../context/CharacterProvider';
import CharacterDetail from './CharacterDetail';
import { useAuth } from '../context/AuthContext';
import CharacterDetailForm from '../components/CharacterDetailForm';
import '../styles/CharacterList.scss';

const CharacterList = () => {
    const { characters, handlePatchCharacter, handleDeleteCharacter, handlePostCharacter, currentPage } = useCharacters();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const startCreate = () => {
        setShowForm(true);
        setIsCreating(true);
        setSelectedCharacter(null);
    }

    const startUpdate = (character) => {
        setShowForm(true);
        setIsCreating(false);
        setSelectedCharacter(character);
    }

    const handleCancel = () => {
        setShowForm(false);
        setIsCreating(false);
        setSelectedCharacter(null);
    }

    const characterList = useMemo(() => {
        if (Array.isArray(characters)) {
            return characters.map(character => (
                <CharacterDetail 
                    key={character.id} 
                    {...character}
                    handlePatchCharacter={handlePatchCharacter}
                    handleDeleteCharacter={handleDeleteCharacter}
                    startUpdate={() => startUpdate(character)}
                />
            ));
        } else {
            console.error('Characters is not an array:', characters);
            return null
        }
    }, [characters, handleDeleteCharacter, handlePatchCharacter]);

    if (!currentPage) {
        return null
    }

    return (
        <div className="character-list">
            {(user && characters) ? (
                <>
                    <h1>Characters</h1>
                    {!showForm ? (
                        <button onClick={startCreate}>Create New Character</button>
                    ) : (
                        <button onClick={handleCancel}>Cancel</button>
                    )}
                    {showForm && (
                        <div className="form-container">
                            <CharacterDetailForm
                                character={isCreating ? null : selectedCharacter}
                                handlePatchCharacter={handlePatchCharacter}
                                handlePostCharacter={handlePostCharacter}
                                handleCancel={handleCancel}
                            />
                        </div>
                    )}
                    <ul>
                        {characterList}
                    </ul>
                </>
            ) : (
                <h1>You need to log in to view this page!</h1>
            )}
        </div>
    );
};

export default CharacterList;