import React, { useState } from 'react'
import CharacterDetailForm from '../components/CharacterDetailForm'


const CharacterDetail = ({ id, name, description, alive, handlePatchCharacter, handleDeleteCharacter, handlePostCharacter }) => {
    const [showForm, setShowForm] = useState(false)
    const character = { id, name, description, alive }

    return (
        <li key={id}>
            <span>Name: {name}</span>
            <span>Description: {description}</span>
            <span>{`Is Active: ${alive}`}</span>
            <button onClick={() => setShowForm(true)}>Update</button>
            <button onClick={() => handleDeleteCharacter(id)}>Delete</button>
            {showForm && <CharacterDetailForm character={character} handlePatchCharacter={handlePatchCharacter} handlePostCharacter={handlePostCharacter} />}
        </li>
    )
}

export default CharacterDetail