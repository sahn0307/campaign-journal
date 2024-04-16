import React from 'react'

const CharacterDetail = ({ id, name, class_, race, alignment, age, alive, description, handleDeleteCharacter, startUpdate, campaigns }) => {
    return (
        <li key={id}>
            <span>Name: {name}</span>
            <span>Class: {class_}</span>
            <span>Race: {race}</span>
            <span>Alignment: {alignment}</span>
            <span>Age: {age}</span>
            <span>{`Is Alive: ${alive}`}</span>
            <span>Description: {description}</span>
            <span>Campaigns: {campaigns.map(campaign => <span key={campaign.gamemaster_id}>{campaign.name}</span>)}</span>            
            <button onClick={startUpdate}>Update</button>
            <button onClick={() => handleDeleteCharacter(id)}>Delete</button>
        </li>
    )
}

export default CharacterDetail