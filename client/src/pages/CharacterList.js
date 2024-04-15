import React, { useMemo } from 'react';
import { useCharacters } from '../context/CharacterProvider';
import CharacterDetail from './CharacterDetail';
import { useAuth } from '../context/AuthContext';

const CharacterList = () => {
    const { characters, handlePatchCharacter, handleDeleteCharacter, currentPage } = useCharacters();
    const { user } = useAuth();
    console.log('Current page:', currentPage);

    const characterList = useMemo(() => {
        if (Array.isArray(characters)) {
            return characters.map(character => (
                <CharacterDetail 
                    key={character.id} 
                    {...character}
                    handlePatchCharacter={handlePatchCharacter} 
                    handleDeleteCharacter={handleDeleteCharacter} 
                />
            ));
        } else {
            console.error('Characters is not an array:', characters);
            return null;
        }
    }, [characters, handlePatchCharacter, handleDeleteCharacter]);

    if (!currentPage) {
        return null;
    }

    return (
        <div>
            {(user && characters) ? (
                <>
                    <h1>Characters</h1>
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