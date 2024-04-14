import React, { useState, useEffect } from 'react';
import { getCharacters } from '../services/api';

function CharacterList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        setCharacters(response.data);
      } catch (error) {
        console.error('Failed to fetch characters', error);
      }
    };

    fetchCharacters();
  }, []);

  // ...
}

export default CharacterList;