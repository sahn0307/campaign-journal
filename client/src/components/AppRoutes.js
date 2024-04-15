import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Authentication from '../pages/Authentication';
import Login from '../pages/Login';
import CharacterList from '../pages/CharacterList';
import CharacterDetail from '../pages/CharacterDetail';
import CampaignList from '../pages/CampaignList';
import CampaignDetail from '../pages/CampaignDetail';
import UserProfileList from '../pages/UserProfileList'
import UserProvider from '../context/UserProvider';
import { useState, useEffect } from 'react';
import CampaignProvider from '../context/CampaignProvider';
import CharacterProvider from '../context/CharacterProvider';

function AppRoutes() {
  const [currentPage, setCurrentPage] = useState('');
  let location = useLocation();

  useEffect(() => {
    const validPages = ['signup', 'login', 'characters', 'campaigns', 'profile'];
    const page = location.pathname.split('/')[1]
    if (validPages.includes(page)) {
      setCurrentPage(page);
    } else {
      setCurrentPage('');
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Authentication />} />
      <Route path="/login" element={<Authentication />} />


      <Route path="/campaigns" element={
        <CampaignProvider>
          <CampaignList />
        </CampaignProvider>
      } />
      <Route path="/campaigns/:id" element={
        <CampaignProvider>
          <CampaignDetail />
        </CampaignProvider>
      } />


      <Route path="/characters" element={
        <CharacterProvider>
          <CharacterList />
        </CharacterProvider>
      } />
      <Route path="/characters/:id" element={
        <CharacterProvider>
          <CharacterDetail />
        </CharacterProvider>
      } />
      <Route path="/profile/" element={
        <UserProvider>
          <UserProfileList />
        </UserProvider>
      } />
    </Routes>
  );
}

export default AppRoutes