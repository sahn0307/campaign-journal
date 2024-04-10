import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
// import ErrorPage from '../pages/ErrorPage'
// import LibraryContainer from '../pages/LibraryContainer'
// import Form from '../pages/Form'
// import SingleAlbumDetails from '../pages/SingleAlbumDetails'

// ! Outlets: App
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            // {
            //     path: '/',
            //     element: <LibraryContainer />,
            //     index: true
            // },
            // {
            //     path: '/my-staxx',
            //     element: <LibraryContainer />
            // },
            // {
            //     path: '/add-album',
            //     element: <Form />
            // },
            // {
            //     path: '/album/:id',
            //     element: <SingleAlbumDetails />
            // }
        ]
    }
])

export default router