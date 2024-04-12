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
function App() {
  return (
    <div>
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Authentication />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="characters" element={<CharacterList />}>
            {/* <Route path="create" element={<CharacterForm />} />
            <Route path="update/:id" element={<CharacterForm />} /> */}
            {/* <Route path=":id" element={<CharacterDetail />} /> */}
          </Route>
          <Route path="campaigns" element={<CampaignList />}>
            {/* <Route path="create" element={<CampaignForm />} />
            <Route path="update/:id" element={<CampaignForm />} /> */}
            {/* <Route path=":id" element={<CampaignDetail />} /> */}
          </Route>
        </Route>
      </Routes>
  </Router>
  </div>
  );
}

export default App;