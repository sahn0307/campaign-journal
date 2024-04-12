//! this is index.js
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import routes from './routes.js'
//import './index.scss'
import AuthProvider from './context/AuthProvider'
import NavBar from './components/NavBar';
import Footer from './components/Footer';

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
    <AuthProvider>
        <div>
            <NavBar />
            <RouterProvider router={routes} />
            <Footer />
        </div>
    </AuthProvider>
)

