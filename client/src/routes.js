import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CharacterList from './pages/CharacterList';
import CharacterDetail from './pages/CharacterDetail';
import CampaignList from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import UserProfile from './pages/UserProfile';

const routes = createBrowserRouter([
    {
        path: '/',
        component: <Home />,
    },
    {
        path: '/signup',
        component: <SignUp />
    },
    {
        path: '/login',
        component: <Login />
    },
    {
        path: '/characters',
        component: <CharacterList />
    },
    {
        path: '/characters/:id',
        component: <CharacterDetail />
    },
    {
        path: '/campaigns',
        component: <CampaignList />
    },
    {
        path: '/campaigns/:id',
        component: <CampaignDetail />
    },
    {
        path: '/profile',
        component: <UserProfile />
    }
]);

export default routes;