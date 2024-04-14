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
      <Route path="/characters" element={<CharacterList />} />
      <Route path="/characters/:id" element={<CharacterDetail />} />
      <Route path="/campaigns" element={<CampaignList />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />
      <Route path="/profile/" element={
        <UserProvider>
          <UserProfileList />
        </UserProvider>
      } />
    </Routes>
  );
}

export default AppRoutes