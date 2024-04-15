import React from 'react';

const CharacterDetail = ({ id, name, description, isActive, handlePatchCharacter, handleDeleteCharacter }) => {
    return (
        <li key={id}>
            <span>Name: {name}</span>
            <span>Description: {description}</span>
            <span>{`Is Active: ${isActive}`}</span>
            <button onClick={() => handlePatchCharacter(id)}>Update</button>
            <button onClick={() => handleDeleteCharacter(id)}>Delete</button>
        </li>
    );
};

export default CharacterDetail;