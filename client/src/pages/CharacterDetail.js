import React from 'react'

const CharacterDetail = ({ id, name, description, alive, handleDeleteCharacter, startUpdate }) => {
    return (
        <li key={id}>
            <span>Name: {name}</span>
            <span>Description: {description}</span>
            <span>{`Is Active: ${alive}`}</span>
            <button onClick={startUpdate}>Update</button>
            <button onClick={() => handleDeleteCharacter(id)}>Delete</button>
        </li>
    )
}

export default CharacterDetail