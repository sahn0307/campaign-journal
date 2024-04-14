import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Authentication from '../pages/Authentication';
import Login from '../pages/Login';
import CharacterList from '../pages/CharacterList';
import CharacterDetail from '../pages/CharacterDetail';
import CampaignList from '../pages/CampaignList';
import CampaignDetail from '../pages/CampaignDetail';
import UserProfile from '../pages/UserProfile';
// import CharacterForm from '../pages/CharacterForm';
// import CampaignForm from '../pages/CampaignForm';
import NavBar from './NavBar';
import Footer from './Footer';
import '../styles/style.scss';
import { useState } from 'react';
function App() {
    const [mode, setMode] = useState('light');
  
    const toggleMode = () => {
      setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };
  
    return (
      <Router>
        <div className={`App ${mode}-mode`}>
          <NavBar mode={mode} toggleMode={toggleMode} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Authentication />} />
            <Route path="/login" element={<Authentication />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </Router>
    );
  }
  
  export default App;