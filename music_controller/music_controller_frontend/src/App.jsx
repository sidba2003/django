import HomePageComponent from './components/HomePageComponent.jsx';
import CreateRoomComponent from './components/CreateRoomComponent.jsx';
import RoomJoinComponent from './components/RoomJoinComponent.jsx';
import RootLayout from './layouts/RootLayoutComponent.jsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<RootLayout />}>
                <Route index element={<HomePageComponent />} />
                <Route path='create_room' element={<CreateRoomComponent />} />
                <Route path='join_room' element={<RoomJoinComponent />} />
            </Route>
        )
    )

    return <RouterProvider router={router} />
}